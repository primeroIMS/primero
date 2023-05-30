# frozen_string_literal: true

# Class to export an Indicator
class Exporters::IndicatorExporter < ValueObject
  INITIAL_CHART_WIDTH = 384
  INITIAL_CHART_HEIGHT = 460
  EXCEL_COLUMN_WIDTH = 64
  EXCEL_ROW_HEIGHT = 20
  TOTAL_I18N_KEY = 'managed_reports.total'

  attr_accessor :key, :values, :current_row, :worksheet, :lookups,  :grouped_by, :formats,
                :managed_report, :locale, :workbook, :subcolumn_lookups

  def write
    write_table_header
    start_row = current_row
    write_indicator_data
    last_row = current_row - 1
    write_graph([start_row, last_row])
    self.current_row += 1
  end

  def write_table_header
    write_grey_row
    write_indicator_header
    write_total_row
  end

  def write_grey_row
    worksheet.merge_range(current_row, 0, current_row, columns_number, '', formats[:grey_space])
    self.current_row += 1
  end

  def columns_number
    1
  end

  def write_indicator_header
    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, 1,
      indicator_header,
      formats[:blue_header]
    )
    self.current_row += 1
  end

  def indicator_header
    I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{key}", locale: locale)
  end

  def write_total_row
    worksheet.set_row(current_row, 40)
    worksheet.write(current_row, 1, I18n.t(TOTAL_I18N_KEY, locale: locale), formats[:bold_blue])
    self.current_row += 1
  end

  def write_graph(table_data_rows)
    return unless table_data_rows.present?

    chart = workbook.add_chart(type: 'column', embedded: 1, name: '')
    chart.add_series(build_series(table_data_rows))
    chart.set_size(height: INITIAL_CHART_HEIGHT, width: chart_width(table_data_rows))
    chart.set_legend(none: true)
    chart.set_y_axis(major_unit: 1)
    worksheet.insert_chart(current_row, 0, chart, 0, 0)

    self.current_row += (INITIAL_CHART_HEIGHT / EXCEL_ROW_HEIGHT)
  end

  def build_series(table_data_rows)
    {
      categories: [worksheet.name] + table_data_rows + [0, 0],
      values: [worksheet.name] + table_data_rows + [1, 1],
      points: Exporters::ManagedReportExporter::CHART_COLORS.values.map { |color| { fill: { color: color } } }
    }
  end

  def chart_width(table_data_rows)
    row_count = table_data_rows.last - table_data_rows.first
    return INITIAL_CHART_WIDTH if row_count < 3

    INITIAL_CHART_WIDTH + (row_count * EXCEL_COLUMN_WIDTH)
  end

  def write_indicator_data
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
    display_text = value_display_text(elem)
    worksheet.write(current_row, 0, display_text, formats[:bold_black])
    worksheet.write(current_row, 1, elem['total'])
  end

  def write_indicator_last_row(elem)
    display_text = value_display_text(elem)
    worksheet.write(current_row, 0, display_text, formats[:bold_black_blue_bottom_border])
    worksheet.write(current_row, 1, elem['total'], formats[:blue_bottom_border])
  end

  def value_display_text(elem)
    return I18n.t('managed_reports.incomplete_data') if incomplete_data_value?(elem)
    return I18n.t('managed_reports.total') if total_value?(elem)

    if lookups.blank?
      return I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{elem['id']}", default: elem['id'])
    end

    display_text_from_lookup(elem) || elem['id']
  end

  def incomplete_data_value?(value)
    value.is_a?(Hash) && value['id'].nil?
  end

  def total_value?(value)
    value['id'] == 'total'
  end

  def display_text_from_lookup(elem, lookup_id = nil)
    return unless elem.present?
    return lookups.find_by_code(elem['id'])&.name_i18n&.dig(I18n.locale.to_s) if lookups.is_a?(LocationService)

    lookup_values = lookups.is_a?(Hash) ? lookups[lookup_id] : lookups
    lookup_values.find do |lookup_value|
      value = elem.is_a?(Hash) ? elem['id'] : elem
      lookup_value['id'] == value
    end&.dig('display_text')
  end

  def date_locale
    locale.blank? || I18n.available_locales.exclude?(locale.to_sym) ? I18n.default_locale.to_s : locale
  end
end
