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

  def self.export(managed_report, opts = {})
    exporter = new(managed_report: managed_report)
    exporter.export(opts)
  end

  def export(opts = {})
    buffer = File.new(output_file_path(opts), 'w')
    workbook = WriteXLSX.new(buffer)
    build_formats(workbook)
    write_report_data(workbook)
  rescue StandardError => e
    Rails.logger.error(e.backtrace.join('\n'))
  ensure
    workbook.close
    buffer.close
  end

  def write_report_data(workbook)
    tab_colors = Writexlsx::Colors::COLORS.except(:black, :white).values.uniq
    current_color_index = 0
    managed_report.subreports.each do |subreport|
      tab_color = tab_colors[current_color_index]
      binding.pry
      begin
        subreport_exporter_class = "Exporters::#{subreport.camelize}SubreportExporter".constantize
      rescue NameError
        subreport_exporter_class = Exporters::SubreportExporter
      end

      subreport_exporter = subreport_exporter_class.new(
        id: subreport,
        managed_report: managed_report,
        workbook: workbook,
        tab_color: tab_color,
        formats: @formats
      )
      subreport_exporter.export

      current_color_index += 1
      current_color_index = 0 if current_color_index > tab_colors.length
    end
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
        bold: 1,
        size: 14,
        color: COLORS[:blue],
        align: 'vcenter',
        bottom_color: COLORS[:blue],
        bottom: 1
      ),
      blue_bottom_border: workbook.add_format(bottom_color: COLORS[:blue])
    }
  end
end
