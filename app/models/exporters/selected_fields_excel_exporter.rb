require 'writeexcel'

module Exporters
  class SelectedFieldsExcelExporter < BaseExporter
    class << self

      def id
        'selected_xls'
      end

      def supported_models
        [Child, TracingRequest]
      end

      def excluded_properties
        ['histories']
      end

      def mime_type
        "xls"
      end

      # @returns: a String with the Excel file data
      def export(models, properties_by_module, *args)
        io = StringIO.new
        workbook = WriteExcel.new(io)
        worksheet = workbook.add_worksheet('Selected Fields')
        record_worksheet = workbook.add_worksheet('__record__')

        props = plain_properties(properties_by_module)

        selected_fields_headers = get_header(props[:selected_fields])
        worksheet.write(0, 0, selected_fields_headers)

        record_headers = get_header(props[:record])
        record_worksheet.write(0, 0, record_headers)

        withds = {
          :selected_fields => initial_column_widths(selected_fields_headers),
          :record => initial_column_widths(record_headers)
        }

        row_worksheet = 1
        row_record_worksheet = 1
        models.each do |model|
          row_worksheet = write_row(row_worksheet, props[:selected_fields], worksheet, model, withds[:selected_fields])
          row_record_worksheet = write_row(row_record_worksheet, props[:record], record_worksheet, model, withds[:record])
        end

        set_column_widths(worksheet, withds[:selected_fields])
        set_column_widths(record_worksheet, withds[:record])

        workbook.close
        io.string
      end

      private

      def initial_column_widths(props)
        props.map do |v|
          v.length
        end
      end

      #Return the value based on the property.
      def get_value(model, property)
        if property.array
          if property.type.include?(CouchRest::Model::Embeddable)
            #data from the subform.
            (model.send(property.name) || []).map do |row|
              property.type.properties.map do |p|
                get_value(row, p)
              end
            end
          else
            #multi_select fields.
            (model.send(property.name) || []).join(" ||| ")
          end
        else
          #regular fields.
          get_model_value(model, property)
        end
      end

      def write_row(row, properties, worksheet, model, withds)
        col = 0
        model_type = {'Child' => 'Case'}.fetch(model.class.name, model.class.name)
        #Write id and type of the model.
        worksheet.write(row, col, [model.id, model_type])
        withds[0] = model.id.length if withds[0] < model.id.length
        withds[1] = model_type.length if withds[1] < model_type.length
        #Write other properties a long subforms.
        col = 2
        #By default next row is by 1, but if there is subforms data
        #we need to calculate based on the subforms rows.
        next_row = 1
        (properties || []).each do |property|
          data_row = get_value(model, property)
          if data_row.is_a?(Array)
            #Write subforms in the sheet.
            worksheet.write_col(row, col, data_row)
            #calculate width based on the data.
            data_row.each{|row| row.each{|data| withds[col] = data.to_s.length if withds[col] < data.to_s.length}}
            #Calculate the next column.
            col = col + property.type.properties.size
            #Calculate the next row if there is subforms data.
            next_row = data_row.size if data_row.size > next_row
          else
            #Write regular fields on the sheet.
            worksheet.write(row, col, data_row)
            #calculate width based on the data.
            withds[col] = data_row.to_s.length if withds[col] < data_row.to_s.length
            col = col + 1
          end
        end
        row + next_row
      end

      #Fields are by module and Form Sections, build a more plain
      #structure, all the selected fields in one sheet and
      #the other special section __record__
      def plain_properties(properties_by_module)
        properties = {:selected_fields => [], :record => []}
        properties_by_module.each do |module_id, form_section|
          form_section.each do |form_name, props|
            if form_name == '__record__'
              properties[:record] << props.values
            else
              properties[:selected_fields] << props.values
            end
          end
        end
        properties[:record].flatten!
        properties[:selected_fields].flatten!
        properties
      end

      #Return the header based on the properties.
      def get_header(properties)
        (["_id", "model_type"] +
         properties.map do |property|
           if property.array && property.type.include?(CouchRest::Model::Embeddable)
             #Returns every property in the subform to build the header of the sheet.
             property.type.properties.map{|p| "#{property.name}:#{p.name}"}
           else
             property.name
           end
         end).flatten
      end

      def set_column_widths(worksheet, withds)
        withds.each_with_index do |w, i|
          worksheet.set_column(i, i, w)
        end
      end

    end
  end
end
