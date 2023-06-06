# frozen_string_literal: true

# Class to export an Indicator
class Exporters::IndicatorExporter < ValueObject
  INITIAL_CHART_WIDTH = 384
  INITIAL_CHART_HEIGHT = 460
  EXCEL_COLUMN_WIDTH = 64
  EXCEL_ROW_HEIGHT = 20
  TOTAL_I18N_KEY = 'managed_reports.total'

  attr_accessor :key, :values, :current_row, :worksheet, :lookups, :grouped_by, :formats,
                :managed_report, :locale, :workbook, :subcolumn_lookups, :indicator_rows,
                :indicator_options, :subcolumn_options, :with_total_subcolumn, :indicator_subcolumns

  def initialize(args = {})
    super(args)
    self.with_total_subcolumn = total_subcolumn?
    load_indicator_options
    load_subcolumn_options
  end

  def load_indicator_options
    self.indicator_options = values.each { |option| option['display_text'] = value_display_text(option) }
    sort_options
  end

  def load_subcolumn_options
    if indicator_subcolumns.is_a?(String)
      self.subcolumn_options = subcolumn_lookups if subcolumn_lookups.present?
      self.subcolumn_options = SystemSettings.primary_age_ranges if indicator_subcolumns == 'AgeRange'
      if with_total_subcolumn
        self.subcolumn_options += [{ 'id' => 'total', 'display_text' => I18n.t('managed_reports.total') }]
      end
    else
      self.subcolumn_options = indicator_subcolumns
    end
  end

  def total_subcolumn?
    values.any? { |elem| elem.key?('total') }
  end

  def write
    write_table_header
    write_sub_items_columns_headers
    start_row = current_row
    write_indicator_data
    last_row = current_row - 1
    write_graph([start_row, last_row])
    self.current_row += 1
  end

  def write_table_header
    write_grey_row
    write_indicator_header
    write_total_row unless with_total_subcolumn
  end

  def write_grey_row
    worksheet.merge_range(current_row, 0, current_row, columns_number, '', formats[:grey_space])
    self.current_row += 1
  end

  def columns_number
    subcolumn_options.present? ? subcolumn_options.size : 1
  end

  def write_indicator_header
    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, columns_number,
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

  def write_sub_items_columns_headers
    return if subcolumn_options.blank?

    subcolumn_options.each_with_index do |subcolumn, subcolumn_index|
      worksheet.write(
        current_row, subcolumn_index + 1, build_label(subcolumn), formats[:bold_blue]
      )
    end

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
      values: [worksheet.name] + table_data_rows + [columns_number, columns_number],
      points: Exporters::ManagedReportExporter::CHART_COLORS.values.map { |color| { fill: { color: color } } }
    }
  end

  def chart_width(table_data_rows)
    row_count = table_data_rows.last - table_data_rows.first
    return INITIAL_CHART_WIDTH if row_count < 3

    INITIAL_CHART_WIDTH + (row_count * EXCEL_COLUMN_WIDTH)
  end

  def write_indicator_data
    indicator_options.each do |option|
      if option == indicator_options.last
        write_indicator_last_row(option)
      else
        write_indicator_row(option)
      end
      self.current_row += 1
    end
  end

  def write_indicator_row(elem)
    worksheet.write(current_row, 0, elem['display_text'], formats[:bold_black])
    write_indicators_subcolumns_data(option: elem, cell_format: formats[:black])
    worksheet.write(current_row, columns_number, elem['total'])
  end

  def write_indicator_last_row(elem)
    worksheet.write(current_row, 0, elem['display_text'], formats[:bold_black_blue_bottom_border])
    write_indicators_subcolumns_data(option: elem, cell_format: formats[:blue_bottom_border])
    worksheet.write(current_row, columns_number, elem['total'], formats[:blue_bottom_border])
  end

  def write_indicators_subcolumns_data(params = {})
    return if subcolumn_options.blank?

    subcolumn_options.each_with_index do |subcolumn, subcolumn_index|
      worksheet.write(
        current_row,
        subcolumn_index + 1,
        subcolumn_value(params[:option], subcolumn),
        params[:cell_format]
      )
    end
  end

  def subcolumn_value(option, subcolumn)
    option&.dig(subcolumn_id(subcolumn)) || 0
  end

  def subcolumn_id(subcolumn)
    case subcolumn
    when Hash then subcolumn['id']
    when AgeRange then subcolumn.to_s
    else subcolumn
    end
  end

  def value_display_text(elem)
    return I18n.t('managed_reports.incomplete_data') if incomplete_data_value?(elem)
    return I18n.t('managed_reports.total') if total_value?(elem)

    if lookups.blank? && indicator_rows.blank?
      return I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{elem['id']}", default: elem['id'])
    end

    display_text_from_indicator_row(elem) || display_text_from_lookup(elem) || elem['id']
  end

  def incomplete_data_value?(value)
    value.is_a?(Hash) && value['id'].nil?
  end

  def total_value?(value)
    value['id'] == 'total'
  end

  def display_text_from_indicator_row(elem)
    return unless elem.present?

    indicator_rows.find do |indicator_row|
      value = elem.is_a?(Hash) ? elem['id'] : elem
      indicator_row['id'] == value
    end&.dig('display_text', locale)
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

  def sort_options
    return sort_options_age_ranges if key == 'age'
    return if lookups.is_a?(LocationService)

    sort_options_lookups if lookups.present?
    sort_options_rows if indicator_rows.present?
  end

  def sort_options_rows
    self.indicator_options = indicator_options.sort_by do |option|
      indicator_rows.find_index { |row| row['id'] == option['id'] } || indicator_rows.size
    end
  end

  def sort_options_lookups
    self.indicator_options = indicator_options.sort_by do |option|
      lookups.find_index { |lookup_value| lookup_value['id'] == option['id'] } || lookups.size
    end
  end

  def sort_options_age_ranges
    age_ranges = SystemSettings.primary_age_ranges.map(&:to_s)
    self.indicator_options = indicator_options.sort_by { |option| age_ranges.find_index { |age_range| option['id'] == age_range } || age_ranges.size }
  end

  def date_locale
    locale.blank? || I18n.available_locales.exclude?(locale.to_sym) ? I18n.default_locale.to_s : locale
  end

  def calculate_position(*args)
    args.sum
  end

  def build_label(label_key)
    return label_key.to_s if label_key.is_a?(AgeRange)
    return label_key['display_text'] if label_key.is_a?(Hash)

    I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{label_key}", locale: locale)
  end
end
