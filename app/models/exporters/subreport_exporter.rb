# frozen_string_literal: true

# Class to export Incidents
class Exporters::SubreportExporter < ValueObject
  attr_accessor :id, :data, :workbook, :tab_color, :formats, :current_row, :worksheet, :managed_report, :locale

  def export
    self.current_row ||= 0
    self.data = managed_report.data[id]
    # TODO: The worksheet name has to be translated
    self.worksheet = workbook.add_worksheet(id)
    write_export
  end

  def write_export
    write_header
    write_params
    write_generated_on
    write_indicators
  end

  def write_header
    worksheet.set_column(current_row, 0, 80)
    worksheet.set_row(current_row, 40)
    worksheet.tab_color = tab_color
    worksheet.merge_range(
      current_row, 0, 0, 1,
      I18n.t("managed_reports.#{managed_report.id}.reports.#{id}"),
      formats[:header]
    )
    self.current_row += 1
  end

  def write_params
    worksheet.set_row(current_row, 20)
    # TODO: Will this be problematic for arabic languages?
    worksheet.merge_range_type(
      'rich_string',
      current_row, 0, current_row, 1,
      formats[:bold_blue], "#{I18n.t('fields.date_range_field')}: ",
      formats[:black], "#{I18n.t('managed_reports.date_range_options.this_quarter')} / ",
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.date')}: ",
      formats[:black], '2021-12-05 / ',
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.verification_status')}: ",
      formats[:black], 'Verified',
      formats[:black]
    )
    self.current_row += 1
  end

  def write_generated_on
    worksheet.merge_range_type(
      'rich_string',
      current_row, 0, current_row, 1,
      formats[:bold_blue], "#{I18n.t('managed_reports.generated_on')}: ",
      formats[:black], Time.now.strftime('%Y-%m-%d %H:%M:%S'),
      formats[:black]
    )
    self.current_row += 1
  end

  def write_table_header(indicator)
    write_grey_row

    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, 1,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"),
      formats[:blue_header]
    )
    self.current_row += 1

    write_total_row
  end

  def write_grey_row
    worksheet.merge_range(current_row, 0, current_row, 1, '', formats[:grey_space])
    self.current_row += 1
  end

  def write_total_row
    worksheet.set_row(current_row, 40)
    worksheet.write(current_row, 1, I18n.t('managed_reports.total'), formats[:bold_blue])
    self.current_row += 1
  end

  def write_graph(table_data_rows)
    chart = workbook.add_chart(type: 'column', embedded: 1)
    chart.add_series(
      categories: ['incidents'] + table_data_rows + [0, 0],
      values: ['incidents'] + table_data_rows + [1, 1],
      points: Exporters::ManagedReportExporter::CHART_COLORS.values.map { |color| { fill: { color: color } } }
    )
    chart.set_title(name: '')
    chart.set_size(height: 460)
    chart.set_legend(none: true)
    worksheet.insert_chart(current_row, 0, chart, 0, 0)

    # A row is 20px height 460 / 20 = 23
    # width on the other hand is 64px

    self.current_row += 23
  end

  def write_indicators
    data.entries.each do |(indicator_key, indicator_values)|
      next unless indicator_values.is_a?(Array)

      write_table_header(indicator_key)
      start_row = current_row
      write_indicator(indicator_values)
      last_row = current_row - 1
      write_graph([start_row, last_row])
      self.current_row += 1
    end
  end

  def write_indicator(values)
    values.each do |elem|
      if elem == values.last
        write_indicator_last_row(elem)
      else
        write_indicator_row(elem)
      end
      self.current_row += 1
    end
  end

  def write_indicator_row(elem)
    worksheet.write(current_row, 0, elem['id'], formats[:bold_black])
    worksheet.write(current_row, 1, elem['total'])
  end

  def write_indicator_last_row(elem)
    worksheet.write(current_row, 0, elem['id'], formats[:bold_black_blue_bottom_border])
    worksheet.write(current_row, 1, elem['total'], formats[:blue_bottom_border])
  end
end
