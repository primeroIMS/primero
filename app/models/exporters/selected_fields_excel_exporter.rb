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
        workbook.add_worksheet('__record__')
        record_worksheet = workbook.sheets(1).first
        worksheet = workbook.sheets(0).first
        headers = get_headers(properties_by_module)

        record_worksheet.write(0,0, headers[:record_fields])
        worksheet.write(0, 0, headers[:fields])

        models.each_with_index do |model, row|
          row += 1
          headers[:fields].each_with_index{|prop_name, cell| build_worksheet(row, cell, prop_name, worksheet, model)}
          headers[:record_fields].each_with_index{|prop_name, cell| build_worksheet(row, cell, prop_name, record_worksheet, model)}
        end

        set_column_widths(worksheet, headers[:fields])
        set_column_widths(record_worksheet, headers[:record_fields] )
        workbook.close
        io.string
      end

      private

      def build_worksheet(row, cell, property, worksheet, model)
        if property == 'model_type'
          worksheet.write(row, cell, {'Child' => 'Case'}.fetch(model.class.name, model.class.name))
        else
          worksheet.write(row, cell, get_model_value(model, property))
        end
      end

      def get_headers(properties_by_module)
        headers = {}
        headers[:fields] = []
        headers[:record_fields] = []

        properties_by_module.each do |module_id, form_section|
          form_section.each do |form_name, prop|
            if form_name != '__record__'
              (headers[:fields] << prop.keys).flatten!
            else
              (headers[:record_fields] << prop.keys).flatten!
            end
          end
        end

        record_id_fields = ["_id", "model_type"]
        headers[:fields] = (record_id_fields + headers[:fields]).flatten
        headers[:record_fields] = (record_id_fields+ headers[:record_fields]).flatten
        headers
      end

      def set_column_widths(worksheet, header)
        header.each_with_index do |v, i|
          worksheet.set_column(i, i, v.length+5)
        end
      end
    end
  end
end
