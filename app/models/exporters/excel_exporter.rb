require 'writeexcel'

module Exporters
  class ExcelExporter < BaseExporter
    class << self
      def id
        'xls'
      end

      def excluded_properties
        ['histories']
      end

      # @returns: a String with the Excel file data
      def export(models, properties_by_form, *args)
        @sheets = {}

        io = StringIO.new
        workbook = WriteExcel.new(io)
        models.each do |model|
          properties_by_form.each do |form_name, properties|
            sheet = build_sheet(form_name, {"_id" => "_id", "model_type" => "model_type"}.merge(properties), workbook)
            data = build_data(model, {"_id" => "_id", "model_type" => "model_type"}.merge(properties))
            sheet["work_sheet"].write(sheet["row"], 0, data)
            sheet["column_widths"] = column_widths(sheet["column_widths"], data)
            sheet["row"] += 1
            sheet["column_widths"].each_with_index {|w, i| sheet["work_sheet"].set_column(i, i, w)}
          end
        end
        workbook.close
        io.string
      end

      private

      def get_value(model, property)
        if property.is_a?(String)
          if property == "model_type"
            model.class.name
          elsif property == "_id"
            model.id
          else
            model.send(property)
          end
        else
          if property.array == false
            model.send(property.name)
          elsif property.array == true && !property.type.include?(CouchRest::Model::Embeddable)
            (model.send(property.name) || []).join(" ||| ")
          end
          #TODO processing of CouchRest::Model::Embeddable.
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

      def build_sheet(form_name, properties, workbook)
        return @sheets[form_name] if @sheets[form_name].present?
        work_sheet = generate_work_sheet(workbook, form_name)
        header = build_header(properties)
        work_sheet.write(0, 0, header)
        column_widths = initial_column_widths(header)
        @sheets[form_name] = {"work_sheet" => work_sheet, "column_widths" => column_widths, "row" => 1}
      end

      def generate_work_sheet(workbook, form_name)
        #Clean up name and truncate to the allowed limit.
        work_sheet_name = form_name.sub(/[\[\]\:\*\?\/\\]/, " ").truncate(31)
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

      def build_header(properties)
        properties.map do |key, property|
          if property.is_a?(String)
            property
          else
            property.name
          end
        end
      end

    end
  end
end
