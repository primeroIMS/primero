# frozen_string_literal: true

# Class to export Incidents
class Exporters::SubreportExporter < ValueObject
  attr_accessor :id, :data, :workbook, :tab_color, :formats, :current_row, :worksheet, :managed_report

  def export
    self.current_row ||= 0
    self.data = managed_report.data[id]
    # TODO: The worksheet name has to be translated
    self.worksheet = workbook.add_worksheet(id)
    write_header
    #write_combined_table(worksheet, subreport)
    write_indicators
  end

  def write_header
    worksheet.set_column(current_row, 0, 80)
    worksheet.set_row(current_row, 40)
    worksheet.tab_color = tab_color
    worksheet.merge_range(
      current_row,
      0,
      0,
      1,
      I18n.t("managed_reports.#{managed_report.id}.reports.#{id}"),
      @formats[:header]
    )

    write_params
    write_generated_on
  end

  def write_params
    self.current_row += 1
    worksheet.set_row(current_row, 20)
    # TODO: Will this be problematic for arabic languages?
    worksheet.merge_range_type(
      'rich_string',
      current_row,
      0,
      current_row,
      1,
      formats[:bold_blue],
      "#{I18n.t('fields.date_range_field')}: ",
      formats[:black],
      "#{I18n.t('managed_reports.date_range_options.this_quarter')} / ",
      formats[:bold_blue],
      "#{I18n.t('managed_reports.filter_by.date')}: ",
      formats[:black],
      '2021-12-05 / ',
      formats[:bold_blue],
      "#{I18n.t('managed_reports.filter_by.verification_status')}: ",
      formats[:black],
      'Verified',
      formats[:black]
    )
  end

  def write_generated_on
    self.current_row += 1
    worksheet.merge_range_type(
      'rich_string',
      current_row,
      0,
      current_row,
      1,
      formats[:bold_blue],
      "#{I18n.t('managed_reports.generated_on')}: ",
      formats[:black],
      Time.now.strftime('%Y-%m-%d %H:%M:%S'),
      formats[:black]
    )
  end

  def write_table_header(indicator)
    self.current_row += 1
    worksheet.merge_range(current_row, 0, current_row, 1, '', formats[:grey_space])

    self.current_row += 1
    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row,
      0,
      current_row,
      1,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"),
      formats[:blue_header]
    )

    self.current_row += 1
    worksheet.set_row(current_row, 40)
    worksheet.write(current_row, 1, I18n.t('managed_reports.total'), formats[:bold_blue])
  end

  def write_graph(table_data_rows)
    chart = workbook.add_chart(type: 'column', embedded: 1)
    chart.add_series(
      name: '=incidents!$A$1',
      categories: ['incidents'] + table_data_rows + [0, 0],
      values: ['incidents'] + table_data_rows + [1, 1]
    )
    chart.set_title(name: '')
    chart.set_size(height: 460)

    worksheet.insert_chart(current_row + 1, 0, chart, 0, 0)

    # A row is 20px height 460 / 20 = 23
    # width on the other hand is 64px
    self.current_row += 23
  end

  def write_indicators
    indicators = data.keys
    indicators.each do |indicator|
      indicator_data = data[indicator]
      next unless indicator_data.is_a?(Array)

      write_table_header(indicator)

      table_data_rows = [@current_row]
      indicator_data.each do |indicator_elem|
        self.current_row += 1
        worksheet.write(
          current_row,
          0,
          indicator_elem['id'],
          @formats[:bold_black]
        )
        worksheet.write(current_row, 1, indicator_elem['total'])
        # TODO: The last row has a blue border in the bottom
      end

      table_data_rows.push(current_row)

      write_graph(table_data_rows)

      self.current_row += 1
    end
  end
end
