# frozen_string_literal: true

# Class to export ManagedReport (insights)
class Exporters::ManagedReportExporter < ValueObject
  attr_accessor :managed_report

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
    exporter = new(managed_report: managed_report)
    exporter.export(opts)
  end

  def export(opts = {})
    buffer = File.new(output_file_path(opts), 'w')
    workbook = WriteXLSX.new(buffer)
    build_formats(workbook)
    write_report_data(workbook, opts)
  rescue StandardError => e
    Rails.logger.error(e.backtrace.join('\n'))
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
        tab_color: tab_color, formats: @formats, locale: opts[:locale]
      ).export
      color_index += 1
      color_index = 0 if color_index > tab_colors.length
    end
  end

  def subreport_exporter_class(subreport)
    "Exporters::#{subreport.camelize}SubreportExporter".constantize
  rescue NameError
    Exporters::SubreportExporter
  end

  def output_file_path(opts)
    return default_output_file_path unless opts[:file_name].present?

    file_name = opts[:file_name]
    file_name += '.xlsx' unless file_name.ends_with?('.xlsx')
    file_name.gsub(/\s+/, '_')

    File.join(Rails.configuration.exports_directory, file_name)
  end

  def default_output_file_path
    File.join(
      Rails.configuration.exports_directory,
      "#{managed_report.id}-#{Time.now.strftime('%Y%m%d.%M%S%M%L')}.xlsx"
    )
  end

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
end
