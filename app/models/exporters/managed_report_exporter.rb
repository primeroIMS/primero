# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export ManagedReport (insights)
class Exporters::ManagedReportExporter < ValueObject
  attr_accessor :managed_report, :opts, :file_name, :errors

  COLORS = {
    blue: '#0F809E',
    black: '#231F20',
    light_grey: '#F0F0F0',
    light_grey2: '#E0E0E0'
  }.freeze

  CHART_COLORS = {
    blue: '#0093BA',
    grey: '#595952',
    purple: '#7C347B',
    green: '#839E3C',
    red: '#D0101B',
    orange: '#E7712D',
    yellow: '#F2C317'
  }.freeze

  def self.export(managed_report, opts = {})
    exporter = new(managed_report:, opts:)
    exporter.export
  end

  def export
    @buffer = output_buffer
    @workbook = WriteXLSX.new(@buffer)
    build_formats
    write_report_data(opts)
    @buffer.is_a?(File) ? @buffer : @buffer.string
  rescue StandardError => e
    puts e.backtrace
    self.errors = [e.message]
  ensure
    close_export
  end

  def close_export
    @workbook.close
    @buffer.close
  end

  def write_report_data(opts)
    tab_colors = Writexlsx::Colors::COLORS.except(:black, :white).values.uniq
    color_index = 0
    subreports_to_export(opts).each do |subreport|
      tab_color = tab_colors[color_index]
      subreport_exporter_class(subreport).new(
        id: subreport, managed_report:, workbook: @workbook,
        tab_color:, formats: @formats, locale: locale(opts)
      ).export
      color_index > tab_colors.length ? color_index = 0 : color_index += 1
    end
  end

  def subreport_exporter_class(subreport)
    if ManagedReport.list[Permission::CASE_MANAGEMENT_KPIS_REPORT].subreports.include?(subreport)
      return Exporters::CaseManagementKpiSubreportExporter
    end

    "Exporters::#{subreport.camelize}SubreportExporter".constantize
  rescue NameError
    Exporters::SubreportExporter
  end

  def subreports_to_export(opts)
    return managed_report.subreports if opts&.dig(:subreport_id).blank? || opts&.dig(:subreport_id) == 'all'

    managed_report.subreports.select { |subreport| subreport == opts[:subreport_id] }
  end

  def output_file_path(opts)
    return default_output_file_path unless opts&.dig(:file_name).present?

    file_name = opts[:file_name]
    file_name += '.xlsx' unless file_name.ends_with?('.xlsx')
    file_name.gsub(/\s+/, '_')

    File.join(Rails.root, 'tmp', file_name)
  end

  def default_output_file_path
    File.join(Rails.root, 'tmp', default_file_name)
  end

  def default_file_name
    timestamp = Time.now.strftime('%Y%m%d.%M%S%M%L')
    date_field_name = managed_report.date_field_name
    verified_value = managed_report.verified_value
    file_name = managed_report.id
    file_name = "#{file_name}_#{date_field_name}" if date_field_name.present?
    file_name = "#{file_name}_#{verified_value}" if verified_value.present?

    "#{file_name}_#{timestamp}.xlsx"
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def build_formats
    @formats = {
      header: @workbook.add_format(bold: 1, size: 16, align: 'vcenter'),
      bold_blue: @workbook.add_format(bold: 1, color: COLORS[:blue]),
      bold_blue_align: @workbook.add_format(bold: 1, color: COLORS[:blue], align: 'center'),
      black: @workbook.add_format(color: COLORS[:black]),
      bold_black: @workbook.add_format(bold: 1, color: COLORS[:black]),
      grey_space: @workbook.add_format(bg_color: COLORS[:light_grey], top: 1, top_color: COLORS[:light_grey2]),
      blue_header: @workbook.add_format(
        bold: 1, size: 14,
        color: COLORS[:blue],
        align: 'vcenter',
        bottom_color: COLORS[:blue],
        bottom: 2
      ),
      bold_black_blue_bottom_border: @workbook.add_format(
        bold: 1,
        color: COLORS[:black],
        bottom: 1,
        bottom_color: COLORS[:blue]
      ),
      blue_bottom_border: @workbook.add_format(bottom: 1, bottom_color: COLORS[:blue])
    }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def output_buffer
    return StringIO.new if opts&.dig(:output_to_file) == false

    file = File.new(output_file_path(opts), 'w')
    self.file_name = file.path
    file
  end

  def locale(opts)
    return opts[:locale] if opts&.dig(:locale).present?

    managed_report.user&.locale || I18n.default_locale
  end
end
