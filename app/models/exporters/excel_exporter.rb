# frozen_string_literal: true

require 'writeexcel'

module Exporters
  # Export records to Excel. Every form ius represented by a new tab.
  # Subforms get a dedicated tab.
  # This uses the writeexcel gem which only support XLS (Excel 2008 format)
  # and is a 1000 years old. However it does support buffered output,
  # which is why we are sticking with it for now.
  class ExcelExporter < BaseExporter
    attr_accessor :workbook, :worksheets

    class << self
      def id
        'xls'
      end

      def supported_models
        [Child, TracingRequest]
      end
    end

    def initialize(output_file_path = nil)
      super(output_file_path)
      self.workbook = WriteExcel.new(buffer)
      self.worksheets = {}
    end

    def export(records, user, options = {})
      establish_export_constraints(records, user, options)
      build_worksheets_with_headers

      records.each do |record|
        write_record(record)
      end
    end

    def build_worksheets_with_headers
      return if worksheets.present?

      forms.each do |form|
        build_worksheet_with_headers(form)
      end
    end

    def build_worksheet_with_headers(form)
      worksheet = build_worksheet(form)
      worksheet&.write(0, 0, 'ID')
      form.fields.each_with_index do |field, i|
        if field.type == Field::SUBFORM
          build_worksheet_with_headers(field.subform)
        else
          worksheet&.write(0, i + 1, field.display_name(locale))
        end
      end
      worksheets[form.unique_id] = { worksheet: worksheet, row: 1 }
    end

    def build_worksheet(form)
      # Don't build a separate worksheet for a form that only contains subform fields
      return if only_subform_fields?(form)

      name = worksheet_name(form)
      begin
        workbook.add_worksheet(name)
      rescue RuntimeError
        workbook.add_worksheet("#{name[0..-3]}-1")
      end
    end

    def only_subform_fields?(form)
      !form.fields.find { |field| field.type != Field::SUBFORM }
    end

    def worksheet_name(form)
      name = form.name('en')
      name.sub(%r{[\[\]:*?\/\\]}, ' ')
          .encode('iso-8859-1', undef: :replace, replace: '')
          .strip.truncate(31)
    end

    def write_record(record)
      forms.each do |form|
        write_record_form(record.short_id, record.data, form)
      end
    end

    def write_record_form(id, data, form)
      worksheet = worksheets[form.unique_id][:worksheet]
      worksheet&.write(worksheets[form.unique_id][:row], 0, id)
      form.fields.each_with_index do |field, i|
        if field.type == Field::SUBFORM
          data[field.name].each do |subform_data|
            write_record_form(id, subform_data, field.subform)
          end
        else
          value = export_value(data[field.name], field)
          worksheet&.write(worksheets[form.unique_id][:row], i + 1, value)
        end
      end
      worksheets[form.unique_id][:row] += 1
    end

    def export_value(value, field)
      value = super(value, field)
      return value unless value.is_a? Array

      value.join(' ||| ')
    end

    def complete
      @workbook.close
      buffer
    end
  end
end