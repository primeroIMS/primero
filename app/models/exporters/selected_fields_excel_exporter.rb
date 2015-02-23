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
        workbook.add_worksheet('Selected Fields')
        worksheet = workbook.sheets(0).first
        headers = get_headers(properties_by_module)
        worksheet.write(0, 0, headers)

        models.each_with_index do |model, row|
          row += 1
          headers.each_with_index do |prop_name, cell|
            if prop_name == 'model_type'
              worksheet.write(row, cell, {'Child' => 'Case'}.fetch(model.class.name, model.class.name))
            else
              worksheet.write(row, cell, model.send(prop_name))
            end
          end
        end
        set_column_widths(worksheet, headers)
        workbook.close
        io.string
      end

      private

      def get_headers(properties_by_module)
        headers = []
        properties_by_module.each{|module_id, form_section| form_section.each{|form_name, prop| headers << prop.keys}}.flatten
        (["_id", "model_type"] + headers).flatten
      end

      def set_column_widths(worksheet, header)
        header.each_with_index do |v, i|
          worksheet.set_column(i, i, v.length+5)
        end
      end
    end
  end
end
