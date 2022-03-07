# frozen_string_literal: true

# Class to export ManagedReport (insights)
class Exporters::ManagedReportExporter < ValueObject
  attr_accessor :managed_report

  def self.export(managed_report, opts = {})
    exporter = new(managed_report: managed_report)
    exporter.export(opts)
  end

  def export(opts = {})
    buffer = File.new(output_file_path(opts), 'w')
    workbook = WriteXLSX.new(buffer)
    colors = Writexlsx::Colors::COLORS.values.uniq
    current_color_index = 0
    managed_report.subreports.each do |subreport|
      worksheet = workbook.add_worksheet(subreport)
      tab_color = colors[current_color_index]
      build_formats(workbook)
      write_header(worksheet, subreport, tab_color)
      @current_row = 2
      write_combined_table(worksheet, subreport)
      write_indicator_array(workbook, worksheet, subreport)
      current_color_index += 1
      current_color_index = 0 if current_color_index > colors.length
    end

    workbook.close
    buffer.close
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

  def write_header(worksheet, subreport, tab_color)
    worksheet.set_column(0, 0, 80)
    worksheet.set_row(0, 40)
    worksheet.tab_color = tab_color
    worksheet.merge_range(
      0,
      0,
      0,
      1,
      I18n.t("managed_reports.#{managed_report.id}.reports.#{subreport}"),
      @formats[:header]
    )

    worksheet.set_row(1, 20)
    # TODO: Will this be problematic for arabic languages?
    worksheet.merge_range_type(
      'rich_string',
      1,
      0,
      1,
      1,
      @formats[:bold_blue],
      "#{I18n.t('fields.date_range_field')}: ",
      @formats[:black],
      "#{I18n.t('managed_reports.date_range_options.this_quarter')} / ",
      @formats[:bold_blue],
      "#{I18n.t('managed_reports.filter_by.date')}: ",
      @formats[:black],
      '2021-12-05 / ',
      @formats[:bold_blue],
      "#{I18n.t('managed_reports.filter_by.verification_status')}: ",
      @formats[:black],
      'Verified',
      @formats[:black]
    )

    worksheet.merge_range_type(
      'rich_string',
      2,
      0,
      2,
      1,
      @formats[:bold_blue],
      "#{I18n.t('managed_reports.generated_on')}: ",
      @formats[:black],
      Time.now.strftime('%Y-%m-%d %H:%M:%S'),
      @formats[:black]
    )
  end

  def write_table_header(worksheet, subreport)
    @current_row += 1
    worksheet.merge_range(@current_row, 0, @current_row, 1, '', @formats[:grey_space])

    @current_row += 1
    worksheet.set_row(@current_row, 30)
    worksheet.merge_range(
      @current_row,
      0,
      @current_row,
      1,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{subreport}"),
      @formats[:blue_header]
    )

    @current_row += 1
    worksheet.set_row(@current_row, 40)
    worksheet.write(
      @current_row,
      1,
      I18n.t('managed_reports.total'),
      @formats[:bold_blue]
    )
  end

  def write_indicator_array(workbook, worksheet, subreport)
    subreport_data = managed_report.data[subreport]
    indicators = subreport_data.keys
    indicators.each do |indicator|
      indicator_data = subreport_data[indicator]
      next unless indicator_data.is_a?(Array)

      write_table_header(worksheet, indicator)

      table_rows = [@current_row]
      indicator_data.each do |nested|
        @current_row += 1
        worksheet.write(
          @current_row,
          0,
          nested['id'],
          @formats[:bold_black]
        )
        worksheet.write(@current_row, 1, nested['total'])
        # TODO: The last row has a blue border in the bottom
      end

      table_rows.push(@current_row)

      write_graph(workbook, worksheet, table_rows)

      @current_row += 1
    end
  end

  def write_graph(workbook, worksheet, table_rows)
    chart = workbook.add_chart(type: 'column', embedded: 1)
    chart.add_series(
      name: '=incidents!$A$1',
      categories: ['incidents'] + table_rows + [0, 0],
      values: ['incidents'] + table_rows + [1, 1]
    )
    chart.set_size(width: 640, height: 460)

    worksheet.insert_chart(@current_row + 1, 0, chart, 0, 0)

    # A row is 20px height 460 / 20 = 23
    # width on the other hand is 64px
    @current_row += 23
  end

  def write_combined_table(worksheet, subreport)
    combined_data = build_combined_data(subreport)
    write_table_header(worksheet, 'combined')
    combined_data.each do |elem|
      @current_row += 1
      worksheet.write(
        @current_row,
        0,
        elem.first,
        @formats[:bold_black]
      )
      worksheet.write(@current_row, 1, elem.last)
    end

    @current_row += 1
  end

  def build_combined_data(subreport)
    subreport_data = managed_report.data[subreport]

    [
      [
        I18n.t("managed_reports.#{managed_report.id}.sub_reports.total"),
        subreport_data[:total]
      ],
      [
        I18n.t("managed_reports.#{managed_report.id}.sub_reports.gbv_sexual_violence"),
        subreport_data['gbv_sexual_violence']
      ],
      [
        I18n.t("managed_reports.#{managed_report.id}.sub_reports.gbv_previous_incidents"),
        subreport_data['gbv_previous_incidents']
      ]
    ]
  end

  def build_formats(workbook)
    @formats = {
      header: workbook.add_format(bold: 1, size: 16, align: 'vcenter'),
      bold_blue: workbook.add_format(bold: 1, color: '#0F809E'),
      black: workbook.add_format(color: '#00000'),
      bold_black: workbook.add_format(bold: 1, color: '#00000'),
      grey_space: workbook.add_format(bg_color: '#F0F0F0', top: 1, top_color: '#E0E0E0'),
      blue_header: workbook.add_format(bold: 1, size: 14, color: '#0F809E', align: 'vcenter', bottom_color: '#0F809E', bottom: 1),
      blue_bottom_border: workbook.add_format(bottom_color: '#0F809E')
    }
  end
end
