# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Class to export the UnusedFieldsReport
class Exporters::UnusedFieldsExporter < ValueObject
  HEADERS = [
    'Field ID',
    'Field Name',
    'Form Name',
    'Cases where filled',
    'Prevalence',
    'Created At'
  ].freeze

  attr_accessor :data, :file_name, :errors, :workbook, :formats, :worksheet

  def self.export(data)
    exporter = new(data:)
    exporter.export
  end

  def export
    @buffer = StringIO.new
    self.workbook = WriteXLSX.new(@buffer)
    setup_formats
    write_report_data
    @buffer.string
  rescue StandardError => e
    puts e.backtrace
    self.errors = [e.message]
  ensure
    close_export
  end

  def write_report_data
    self.worksheet = workbook.add_worksheet('Unused Fields Report')
    @current_row = 0

    write_last_generated
    write_field_data
  end

  def write_field_data
    data.each do |elem|
      primero_module = PrimeroModule.find_by(unique_id: elem['module_id'])
      write_title(primero_module, elem['total_records'])
      write_headers
      write_stats(elem['field_stats'])
      @current_row += 3
    end
  end

  def write_last_generated
    last_generated = Time.zone.now.strftime('%B %d, %Y at %-l:%M%P')
    worksheet&.merge_range(
      @current_row, 0, @current_row, 5, "Generated Periodically. Last generated on #{last_generated}.", @formats[:title]
    )
  end

  def write_title(primero_module, total_records)
    @current_row += 1
    worksheet.write(@current_row, 0, "#{primero_module.name} - Case")

    @current_row += 2
    worksheet.merge_range(@current_row, 0, @current_row, 5, "Out of #{total_records} Cases...", @formats[:title])
  end

  def write_headers
    @current_row += 3
    worksheet.set_column(0, 5, 20)
    HEADERS.each_with_index do |header, index|
      worksheet&.write(@current_row, index, header, @formats[:header])
    end
  end

  def write_stats(stats)
    @current_row += 1
    stats.sort_by { |stat| stat['prevalence'] }.each do |stat|
      write_field(stat['field'])
      write_form_section(stat['form_section'])
      write_stat(stat['total'], stat['prevalence'])
      @current_row += 1
    end
  end

  def write_field(field)
    worksheet.write(@current_row, 0, field.name)
    worksheet.write(@current_row, 1, field.display_name)
    worksheet.write(@current_row, 5, field.created_at.strftime('%b %-d, %Y %I:%M %p'))
  end

  def write_form_section(form_section)
    worksheet.write(@current_row, 2, form_section.name)
  end

  def write_stat(total, prevalence)
    worksheet.write_number(@current_row, 3, total)
    worksheet.write_number(@current_row, 4, prevalence, @formats[:prevalence])
  end

  def setup_formats
    self.formats = {
      title: workbook.add_format(align: 'left'),
      header: workbook.add_format(bold: 1),
      prevalence: workbook.add_format(num_format: '0.000%')
    }
  end

  def close_export
    workbook.close
    @buffer.close
  end
end
