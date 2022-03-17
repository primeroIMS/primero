# frozen_string_literal: true

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
    exporter = new(managed_report: managed_report, opts: opts)
    exporter.export
  end

  def export
    buffer = output_buffer
    workbook = WriteXLSX.new(buffer)
    build_formats(workbook)
    write_report_data(workbook, opts)
    return buffer.string unless buffer.is_a?(File)

    self.file_name = buffer.path
    buffer
  rescue StandardError => e
    self.errors = [e.message]
  ensure
    workbook.close
    buffer.close
  end

  def write_report_data(workbook, opts)
    tab_colors = Writexlsx::Colors::COLORS.except(:black, :white).values.uniq
    color_index = 0
    managed_report.subreports.each do |subreport|
      tab_color = tab_colors[color_index]
      subreport_exporter_class(subreport).new(
        id: subreport, managed_report: managed_report, workbook: workbook,
        tab_color: tab_color, formats: @formats, locale: locale(opts)
      ).export
      color_index > tab_colors.length ? color_index = 0 : color_index += 1
    end
  end

  def subreport_exporter_class(subreport)
    "Exporters::#{subreport.camelize}SubreportExporter".constantize
  rescue NameError
    Exporters::SubreportExporter
  end

  def output_file_path(opts)
    return default_output_file_path unless opts&.dig(:file_name).present?

    file_name = opts[:file_name]
    file_name += '.xlsx' unless file_name.ends_with?('.xlsx')
    file_name.gsub(/\s+/, '_')

    File.join(Rails.configuration.exports_directory, file_name)
  end

  def default_output_file_path
    File.join(Rails.configuration.exports_directory, default_file_name)
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
  def build_formats(workbook)
    @formats = {
      header: workbook.add_format(bold: 1, size: 16, align: 'vcenter'),
      bold_blue: workbook.add_format(bold: 1, color: COLORS[:blue]),
      black: workbook.add_format(color: COLORS[:black]),
      bold_black: workbook.add_format(bold: 1, color: COLORS[:black]),
      grey_space: workbook.add_format(bg_color: COLORS[:light_grey], top: 1, top_color: COLORS[:light_grey2]),
      blue_header: workbook.add_format(
        bold: 1, size: 14,
        color: COLORS[:blue],
        align: 'vcenter',
        bottom_color: COLORS[:blue],
        bottom: 2
      ),
      bold_black_blue_bottom_border: workbook.add_format(
        bold: 1,
        color: COLORS[:black],
        bottom: 1,
        bottom_color: COLORS[:blue]
      ),
      blue_bottom_border: workbook.add_format(bottom: 1, bottom_color: COLORS[:blue])
    }
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def output_buffer
    return File.new(output_file_path(opts), 'w') unless opts&.dig(:output_to_file) == false

    StringIO.new
  end

  def locale(opts)
    return opts[:locale] if opts&.dig(:locale).present?

    managed_report.user&.locale || I18n.default_locale
  end
end
