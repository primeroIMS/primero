require 'writeexcel'

module Exporters
  class ExcelExporter < BaseExporter
    extend BaseSelectFields

    class << self

      def id
        'xls'
      end

      def supported_models
        [Child, TracingRequest]
      end

      def excluded_properties
        ['histories']
      end

      def properties_to_export(properties_by_module, custom_export_options, models)
        properties_by_module = filter_custom_exports(properties_by_module, custom_export_options)
        return include_metadata_properties(
          properties_by_module, current_model_class(models)
        )
      end

    end

    def initialize(output_file_path=nil)
      super(output_file_path)
      @workbook = WriteExcel.new(self.buffer)
    end

    # @returns: a String with the Excel file data
    def export(models, properties_by_module, current_user, custom_export_options, *args)
      properties_by_module = self.class.properties_to_export(properties_by_module, custom_export_options, models)
      @form_sections = self.class.case_form_sections_by_module(models, current_user)

      unless @sheets.present?
        build_sheets_definition(properties_by_module, models.first.try(:module).try(:name))
      end

      self.class.load_fields(models.first) if models.present?

      models.each do |model|
        sheets_def = get_sheets_by_module(model.module_id)
        counter = 0
        sheets_def.each do |form_name, sheet_def|
          build_sheet(sheet_def, form_name, @workbook, counter)
          data = build_data(model, sheet_def["properties"])
          #Could it be more than one row because the subforms.
          rows = build_rows(model, data)
          rows.each do |row|
            sheet_def["work_sheet"].write(sheet_def["row"], 0, row)
            sheet_def["column_widths"] = column_widths(sheet_def["column_widths"], row)
            sheet_def["row"] += 1
          end
          #TODO: Worksheet#set_column contains a memory leak. Why were we doing this in the first place?
          #sheet_def["column_widths"].each_with_index {|w, i| sheet_def["work_sheet"].set_column(i, i, w)}
          counter += 1
        end
      end
    end

    def complete
      @workbook.close
      return self.buffer
    end

    private

    def get_sheets_by_module(module_id)
      @sheets.select{|form_name, sheet_def| sheet_def["modules"].include?(module_id) }
    end

    def get_value(model, property, parent = nil)
      if property.is_a?(Hash) && parent.present?
        #This is the selected fields of some subform.
        #Parent contains the subform field in the model.
        (model.send(parent) || []).map do |row|
          property.values.map do |p|
            get_value(row, p)
          end
        end
      elsif property.array
        if property.type.include?(CouchRest::Model::Embeddable)
          #Returns every row of the subform.
          (model.send(property.name) || []).map do |row|
            #Remove unique_id field for subforms.
            property.type.properties.select{|p| p.name != 'unique_id'}.map do |p|
              get_value(row, p)
            end
          end
        else
          (self.class.translate_value(property.name, model.send(property.name)) || []).join(" ||| ")
        end
      else
        self.class.get_model_value(model, property)
      end
    end

    def column_widths(column_widths, data)
      col = 0
      data.map do |value|
        if column_widths[col].nil? || (value.to_s.length > column_widths[col])
          length = value.to_s.length
        else
          length = column_widths[col]
        end
        col += 1
        length
      end
    end

    #Build the sheets definition.
    #Split any subform in his own sheet if there is
    #others none subforms properties in the same form section.
    def build_sheets_definition(properties_by_module, model_module=nil)
      @sheets ||= {}
      properties_by_module.each do |module_id, form_sections|
        form_sections.each do |fs_name, properties|
          subforms = properties.select do |prop_name, prop|
            # when there is a Hash is a subforms with some selected fields.
            prop.is_a?(Hash) || (prop.array == true && prop.type.include?(CouchRest::Model::Embeddable))
          end
          others = (properties.to_a - subforms.to_a).to_h

          get_name = model_module.present? ? @form_sections[model_module].select{|fs| fs.unique_id == fs_name}.first.try(:name) : nil
          name = get_name || fs_name
          if subforms.blank? || (subforms.length == 1 && others.blank?)
            #The section does not have subforms or
            #there is just one subform in the form section.
            build_sheet_definition(name, properties, module_id)
          else
            #set the section with the properties that are not subforms if apply.
            build_sheet_definition(name, others, module_id) if others.present?
            #set any subform in this own sheet.
            subforms.each do |prop_name, props|
              sheet_name = prop_name.titleize
              #Make sure don't collision with the names.
              sheet_name = "#{name} #{sheet_name}" if @sheets[sheet_name].present?
              build_sheet_definition(sheet_name, {prop_name => props}, module_id)
            end
          end
        end
      end
    end

    #build the sheet definition.
    #If several form section has the same name, will merge the list properties
    #in the same sheet. The sheet should be unique. Form section names can be
    #found in different modules.
    def build_sheet_definition(fs_name, properties, module_id)
      props = properties
      modules = [module_id]
      if @sheets[fs_name].present?
        #Merge props that probably came from other module same form section name.
        #sheet name should be unique.
        props = @sheets[fs_name]["properties"].merge(props)
        #register to what module belong the form section.
        #sheet name should be unique.
        modules = @sheets[fs_name]["modules"] + modules
      end
      @sheets[fs_name] = {"work_sheet" => nil, "column_widths" => nil, "row" => 1, "properties" => props, "modules" => modules}
    end

    def build_sheet(sheet_def, form_name, workbook, counter)
      return sheet_def["work_sheet"] if sheet_def["work_sheet"].present?
      work_sheet = generate_work_sheet(workbook, form_name, counter)
      header = ["_id", "model_type"] + build_header(sheet_def["properties"])
      work_sheet.write(0, 0, header)
      sheet_def["column_widths"] = initial_column_widths(header)
      sheet_def["work_sheet"] = work_sheet
    end

    def generate_work_sheet(workbook, form_name, counter)
      #Clean up name and truncate to the allowed limit.
      #Patch to remove non-ascii characters
      #TODO - refactor to use gem that better handles unicode characters (such as Arabic)
      work_sheet_name = "(#{counter}) #{form_name.gsub(/[\[\]\:\*\?\/\\]/, " ")}".encode("iso-8859-1", undef: :replace, replace: "").strip.truncate(31)
      worksheet = workbook.sheets.select{|sheet| sheet.name == work_sheet_name}.first
      unless worksheet.present?
        worksheet = workbook.add_worksheet(work_sheet_name)
      end
      return worksheet
    end

    def initial_column_widths(data)
      data.map do |v|
        v.length
      end
    end

    def build_data(model, properties)
      properties.map do |key, property|
        # When there is a Hash is a subforms with some selected fields.
        # Send 'key' because is the subform field name.
        get_value(model, property, property.is_a?(Hash) ? key : nil)
      end
    end

    def build_rows(model, data)
      rows = []
      model_type = {'Child' => 'Case'}.fetch(model.class.name, model.class.name)
      if data.size == 1 && data[0].is_a?(Array)
        #Extract data from the subforms.
        data[0].each do |d|
          rows << [model.id, model_type] + d
        end
      else
        rows << [model.id, model_type] + data
      end
      rows
    end

    def build_header(properties)
      properties.map do |key, property|
        if property.is_a?(Hash)
          #The hash contains the selected fields for a subform.
          property.values.map{|prop| prop.name}
        elsif property.is_a?(String)
          property
        elsif property.array && property.type.include?(CouchRest::Model::Embeddable)
          #Returns every property in the subform to build the header of the sheet.
          #Remove unique_id field for subforms.
          property.type.properties.map{|p| p.name if p.name != "unique_id"}.compact
        else
          property.name
        end
      end.flatten
    end

  end
end
