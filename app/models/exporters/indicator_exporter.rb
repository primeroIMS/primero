# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export an Indicator
# rubocop:disable Metrics/ClassLength
class Exporters::IndicatorExporter < ValueObject
  include Writexlsx::Utility

  INITIAL_CHART_WIDTH = 384
  INITIAL_CHART_HEIGHT = 460
  EXCEL_COLUMN_WIDTH = 64
  EXCEL_ROW_HEIGHT = 20
  TOTAL_I18N_KEY = 'managed_reports.total'

  attr_accessor :key, :values, :current_row, :worksheet, :lookups, :grouped_by, :formats,
                :managed_report, :locale, :workbook, :subcolumn_lookups, :indicator_rows,
                :indicator_options, :subcolumn_options, :with_total_subcolumn, :indicator_subcolumns,
                :table_data_rows, :include_zeros

  def initialize(args = {})
    super(args)
    self.locale = args[:locale] || I18n.default_locale.to_s
    self.with_total_subcolumn = total_subcolumn?
    load_indicator_options
    load_subcolumn_options
  end

  def load_indicator_options
    self.indicator_options = if include_zeros && options_from_indicator.present?
                               options_with_values
                             else
                               options_from_values
                             end
    sort_options
  end

  def options_with_values
    from_values = options_from_values
    options = options_from_indicator.reject { |option| from_values.any? { |value| value['id'] == option['id'] } }
    (options + from_values).map { |option| option.merge('total' => option['total'] || 0) }
  end

  def options_from_indicator
    return lookups if lookups.present?
    return [] unless indicator_rows.present?

    indicator_rows.map do |elem|
      next elem unless elem['display_text'].is_a?(Hash)

      elem.merge('display_text' => elem['display_text'][locale])
    end
  end

  def options_from_values
    values.each_with_object([]) do |option, memo|
      memo << option.merge('display_text' => value_display_text(option))
    end
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
    indicator_subcolumns.present? && values.any? { |elem| elem.key?('total') }
  end

  def write
    write_table_header
    write_sub_items_columns_headers
    start_row = current_row
    write_indicator_data
    last_row = current_row - 1
    self.table_data_rows = [start_row, last_row]
    write_chart if table_data_rows.present?
    self.current_row += 1
  end

  def write_table_header
    write_grey_row
    write_indicator_header
    write_relevant_field
    write_total_row if !with_total_subcolumn && (values.present? || include_zeros)
  end

  def write_grey_row
    worksheet.merge_range(current_row, 0, current_row, columns_number, '', formats[:grey_space])
    self.current_row += 1
  end

  def write_relevant_field
    return unless I18n.exists?("managed_reports.#{managed_report.id}.header_title.#{key}", locale)

    worksheet.write(
      current_row,
      0,
      I18n.t("managed_reports.#{managed_report.id}.header_title.#{key}", locale:),
      formats[:bold_blue]
    )
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
    I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{key}", locale:)
  end

  def write_total_row
    worksheet.set_row(current_row, 40)
    worksheet.write(current_row, 1, I18n.t(TOTAL_I18N_KEY, locale:), formats[:bold_blue])
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

  def write_chart
    chart = setup_chart
    build_series.each { |serie| chart.add_series(serie) }
    worksheet.insert_chart(current_row, 0, chart, 0, 0)
    self.current_row += (INITIAL_CHART_HEIGHT / EXCEL_ROW_HEIGHT)
  end

  def setup_chart
    chart = workbook.add_chart(type: 'column', embedded: 1, name: '')
    chart.set_size(chart_size)
    chart.set_legend(none: true)
    chart.set_x_axis(reverse: 1) if Primero::Application::RTL_LOCALES.include?(locale.to_sym)
    chart.set_y_axis(major_unit: 1)
    chart
  end

  def build_series
    colors = Exporters::ManagedReportExporter::CHART_COLORS.values
    options_size = subcolumn_options.present? ? indicator_options.size + 1 : indicator_options.size
    header_row = current_row - options_size
    categories_row = header_row - 1
    if subcolumn_options.present?
      subcolumn_options_to_series(colors, categories_row, header_row)
    else
      options_to_series(colors, categories_row, header_row)
    end
  end

  def subcolumn_options_to_series(colors, categories_row, header_row)
    indicator_options.each_with_object([]).with_index do |(option, memo), option_index|
      next if option['separator'] == true

      series_data = generate_series_data(categories_row, header_row, option_index)
      color = colors.at(option_index)
      memo << { name: option['display_text'], fill: { color: }, points: [{ fill: { color: } }],
                categories: series_categories(series_data), values: series_values(series_data) }
    end
  end

  def options_to_series(colors, categories_row, header_row)
    indicator_options.each_with_object([]).with_index do |(option, memo), index|
      next if option['separator'] == true

      color = colors.at(index)
      row_value = serie_row_value(header_row, index)
      end_column = serie_end_column(index)
      memo << { name: option['display_text'], fill: { color: }, points: [{ fill: { color: } }],
                categories: [worksheet.name, categories_row, categories_row, 1, end_column],
                values: [worksheet.name, row_value, row_value, serie_start_column, end_column] }
    end
  end

  def generate_series_data(categories_row, header_row, option_index)
    row_value = serie_row_value(header_row, option_index)
    start_column = subcolumn_options.size + 1
    end_column = subcolumn_options.size

    {
      categories: [[categories_row, categories_row, start_column, start_column]],
      values: [[row_value, row_value, end_column, end_column]]
    }
  end

  def series_categories(series_data)
    categories = series_data[:categories].map do |category|
      "#{quote_sheetname(worksheet.name)}!#{xl_range(*category)}"
    end.join(',')
    return "=(#{categories})" unless series_data[:categories].size == 1

    categories
  end

  def series_values(series_data)
    values = series_data[:values].map do |value|
      "#{quote_sheetname(worksheet.name)}!#{xl_range(*value)}"
    end.join(',')

    return "=(#{values})" unless series_data[:values].size == 1

    values
  end

  def serie_row_value(header_row, index)
    row_value = header_row + index
    row_value += 1 if subcolumn_options.present?
    row_value
  end

  def serie_end_column(index)
    end_column = subcolumn_options.present? ? subcolumn_options.size : columns_number
    subcolumn_options.present? ? subcolumn_options.size * (index + 1) : end_column
  end

  def serie_start_column
    subcolumn_options.present? ? subcolumn_options.size : 1
  end

  def chart_size
    { height: INITIAL_CHART_HEIGHT, width: chart_width }
  end

  def chart_width
    row_count = table_data_rows.last - table_data_rows.first
    return INITIAL_CHART_WIDTH if row_count < 3

    INITIAL_CHART_WIDTH + (row_count * EXCEL_COLUMN_WIDTH)
  end

  def write_indicator_data
    indicator_options.each do |option|
      if option['separator'] == true
        write_option_separator(option, current_row)
      elsif option == indicator_options.last
        write_indicator_last_row(option)
      else
        write_indicator_row(option)
      end
      self.current_row += 1
    end
  end

  def write_option_separator(option, row_index)
    worksheet.merge_range(
      row_index,
      0,
      row_index,
      columns_number,
      option['display_text'],
      formats[:bold_blue]
    )
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
    return display_text_from_translation(elem) if translation?(elem)

    display_text_from_metadata(elem)
  end

  def incomplete_data_value?(value)
    value.is_a?(Hash) && value['id'].nil?
  end

  def total_value?(value)
    value['id'] == 'total'
  end

  def translation?(elem)
    I18n.exists?("managed_reports.#{managed_report.id}.sub_reports.#{elem['id']}", locale)
  end

  def display_text_from_translation(elem)
    I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{elem['id']}", default: elem['id'])
  end

  def display_text_from_metadata(elem)
    return unless elem.present?

    display_text_from_indicator_row(elem) || display_text_from_lookup(elem) || elem['id']
  end

  def display_text_from_indicator_row(elem)
    return unless indicator_rows.present?

    display_text = indicator_rows.find do |indicator_row|
      value = elem.is_a?(Hash) ? elem['id'] : elem
      indicator_row['id'] == value
    end&.dig('display_text')

    return display_text[locale] if display_text.is_a?(Hash)

    display_text
  end

  def display_text_from_lookup(elem, lookup_id = nil)
    return unless lookups.present?
    return display_text_from_location(elem) if lookups.is_a?(LocationService)

    lookup_values = lookups.is_a?(Hash) ? lookups[lookup_id] : lookups
    lookup_values.find do |lookup_value|
      value = elem.is_a?(Hash) ? elem['id'] : elem
      lookup_value['id'] == value
    end&.dig('display_text')
  end

  def display_text_from_location(elem)
    lookups.find_by_code(elem['id'])&.name_i18n&.dig(I18n.locale.to_s)
  end

  def sort_options
    return sort_options_age_ranges if key == 'age' && managed_report.id != 'gbv_statistics'
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
    self.indicator_options = indicator_options.sort_by do |option|
      age_ranges.find_index { |age_range| option['id'] == age_range } || age_ranges.size
    end
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

    I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{label_key}", locale:)
  end
end
# rubocop:enable Metrics/ClassLength
