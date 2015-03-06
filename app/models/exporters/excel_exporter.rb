require 'writeexcel'

module Exporters
  class ExcelExporter < BaseExporter
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

      # @returns: a String with the Excel file data
      def export(models, properties_by_module, *args)
        build_sheets_definition(properties_by_module)

        io = StringIO.new
        workbook = WriteExcel.new(io)
        models.each do |model|
          sheets_def = get_sheets_by_module(model.module_id)
          counter = 0
          sheets_def.each do |form_name, sheet_def|
            build_sheet(sheet_def, form_name, workbook, counter)
            data = build_data(model, sheet_def["properties"])
            #Could it be more than one row because the subforms.
            rows = build_rows(model, data)
            rows.each do |row|
              sheet_def["work_sheet"].write(sheet_def["row"], 0, row)
              sheet_def["column_widths"] = column_widths(sheet_def["column_widths"], row)
              sheet_def["row"] += 1
            end
            sheet_def["column_widths"].each_with_index {|w, i| sheet_def["work_sheet"].set_column(i, i, w)}
            counter += 1
          end
        end
        workbook.close
        io.string
      end

      private

      def get_sheets_by_module(module_id)
        @sheets.select{|form_name, sheet_def| sheet_def["modules"].include?(module_id) }
      end

      def get_value(model, property)
        if property.array
          if property.type.include?(CouchRest::Model::Embeddable)
            #Returns every row of the subform.
            (model.send(property.name) || []).map do |row|
              property.type.properties.map do |p|
                get_value(row, p)
              end
            end
          else
            (model.send(property.name) || []).join(" ||| ")
          end
        else
          get_model_value(model, property)
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
      def build_sheets_definition(properties_by_module)
        @sheets = {}
        properties_by_module.each do |module_id, form_sections|
          form_sections.each do |fs_name, properties|
            subforms = properties.select{|prop_name, prop| prop.array == true && prop.type.include?(CouchRest::Model::Embeddable)}
            others = (properties.to_a - subforms.to_a).to_h
            if subforms.blank? || (subforms.length == 1 && others.blank?)
              #The section does not have subforms or
              #there is just one subform in the form section.
              build_sheet_definition(fs_name, properties, module_id)
            else
              #set the section with the properties that are not subforms if apply.
              build_sheet_definition(fs_name, others, module_id) if others.present?
              #set any subform in this own sheet.
              subforms.each do |prop_name, props|
                sheet_name = prop_name.titleize
                #Make sure don't collision with the names.
                sheet_name = "#{fs_name} #{sheet_name}" if @sheets[sheet_name].present?
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
        work_sheet_name = "(#{counter}) #{form_name.sub(/[\[\]\:\*\?\/\\]/, " ")}".truncate(31)
        workbook.add_worksheet(work_sheet_name)
      end

      def initial_column_widths(data)
        data.map do |v|
          v.length
        end
      end

      def build_data(model, properties)
        properties.map do |key, property|
          get_value(model, property)
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
          if property.is_a?(String)
            property
          elsif property.array && property.type.include?(CouchRest::Model::Embeddable)
            #Returns every property in the subform to build the header of the sheet.
            property.type.properties.map{|p| p.name}
          else
            property.name
          end
        end.flatten
      end

    end
  end
end
