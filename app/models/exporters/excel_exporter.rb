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
        filter_custom_exports(properties_by_module, custom_export_options)
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

      models.each do |model|
        sheets_def = get_sheets_by_module(model.module.name)
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
      if property.try(:type) == Field::SUBFORM && parent.present?
        #This is the selected fields of some subform.
        #Parent contains the subform field in the model.
        (model.data[property.name] || []).map do |row|
          property.subform.fields.map do |p|
            get_value(row, p)
          end
        end
      elsif property.try(:multi_select)
        if property.type == Field::SUBFORM
          #Returns every row of the subform.
          (model.send(property.name) || []).map do |row|
            #Remove unique_id field for subforms.
            property.type.properties.select{|p| p.name != 'unique_id'}.map do |p|
              get_value(row, p)
            end
          end
        else
          value = model.try(:data).try(:[], property.name) || model.try(:[], property)
          (value.present? ? self.class.translate_value(property, value) : []).join(" ||| ")
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
      properties_by_module.each do |field|
        if field.type.include?(Field::SUBFORM)
          build_sheet_definition(field.subform.name, field, model_module)
        else
          fields = field.form_section.fields.where.not(type: Field::SUBFORM)
          build_sheet_definition(field.form_section.name, fields, model_module)
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
        @sheets[fs_name]["properties"] = Array(props).map{|f| {f.name => f} }.reduce(&:merge)
        props = @sheets[fs_name]["properties"]
        #register to what module belong the form section.
        #sheet name should be unique.
        modules = @sheets[fs_name]["modules"] + modules
      else
        props = Array(properties).map { |f| {f.try(:name) => f} }.reduce(&:merge)
      end
      @sheets[fs_name] = {"work_sheet" => nil, "column_widths" => nil, "row" => 1, "properties" => props, "modules" => modules}
    end

    def build_sheet(sheet_def, form_name, workbook, counter)
      fields = sheet_def["properties"].map{|f| {f.name => f} }.reduce(&:merge) unless sheet_def["properties"].is_a?(Hash)
      return sheet_def["work_sheet"] if sheet_def["work_sheet"].present?
      work_sheet = generate_work_sheet(workbook, form_name, counter)
      header = ["id", "model_type"] + build_header(sheet_def["properties"])
      work_sheet.write(0, 0, header)
      sheet_def["column_widths"] = initial_column_widths(header)
      sheet_def["work_sheet"] = work_sheet
    end

    def generate_work_sheet(workbook, form_name, counter)
      #Clean up name and truncate to the allowed limit.
      #Patch to remove non-ascii characters
      #TODO - refactor to use gem that better handles unicode characters (such as Arabic)
      work_sheet_name = "(#{counter}) #{form_name.sub(/[\[\]\:\*\?\/\\]/, " ")}".encode("iso-8859-1", undef: :replace, replace: "").strip.truncate(31)
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
        get_value(model, property, property.try(:type) == Field::SUBFORM ? key : nil)
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
        elsif property.type == Field::SUBFORM
          #Returns every property in the subform to build the header of the sheet.
          #Remove unique_id field for subforms.
          property.subform.fields.map{|p| p.name if p.name != "unique_id"}.compact
        else
          property.name
        end
      end.flatten
    end

  end
end
