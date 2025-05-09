# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export an Indicator
# rubocop:disable Metrics/ClassLength
class Exporters::GroupedIndicatorExporter < Exporters::IndicatorExporter
  include Writexlsx::Utility

  GROUPED_CHART_WIDTH = 566
  GROUPED_BY = { month: 'month', year: 'year', quarter: 'quarter', week: 'week' }.freeze

  attr_accessor :groups, :parent_groups

  def initialize(args = {})
    super(args)
    load_groups
  end

  def load_groups
    self.groups = calculate_groups
    self.parent_groups = grouped_by_week? ? groups.keys : groups.keys.sort { |year1, year2| year1.to_i <=> year2.to_i }
  end

  def load_indicator_options
    self.indicator_options = values.map { |elem| elem['data'] }.flatten.uniq { |elem| elem['id'] }
    sort_options
    indicator_options.each { |option| option['display_text'] = value_display_text(option) }
  end

  def calculate_groups
    return calculate_week_groups if grouped_by_week?

    group_list.reduce({}) do |acc, elem|
      next(acc.merge(elem.first => [elem.last])) unless acc[elem.first].present?

      acc.merge(elem.first => acc[elem.first] + [elem.last])
    end
  end

  def calculate_week_groups
    group_list.reduce({}) do |acc, elem|
      next(acc.merge(elem => [elem])) unless acc[elem].present?

      acc.merge(elem => acc[elem] + [elem])
    end
  end

  def group_list
    return [] unless values.present?

    return values.map { |group| group[:group_id] } if grouped_by_week?

    values.map { |group| group[:group_id].to_s.split('-') }
  end

  def columns_number
    columns = groups&.values&.reduce(0) { |acc, val| acc + val.size }
    return 1 unless columns.present? && columns.positive?

    columns
  end

  def write
    write_grouped_table_header
    return if values.blank?

    write_grouped_headers
    write_indicator_options
    write_grouped_indicator_data
    write_chart if indicator_options.present?
  end

  def write_grouped_table_header
    write_grey_row

    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, columns_number * subitems_size,
      build_label(key),
      formats[:blue_header]
    )

    self.current_row += 1
  end

  def write_indicator_options
    display_texts = indicator_options.map { |option| option['display_text'] }
    display_texts.each_with_index do |display_text, index|
      cell_format = display_text == display_texts.last ? formats[:bold_black_blue_bottom_border] : formats[:bold_black]
      worksheet.write(current_row + index, 0, display_text, cell_format)
    end
  end

  def subitems_size
    return 1 unless subcolumn_options.is_a?(Array)

    [subcolumn_options.size, 1].max
  end

  def write_grouped_headers
    if grouped_by_year?
      write_years_headers
    elsif grouped_by_week?
      write_week_headers
    else
      write_groups_headers
    end
    write_sub_items_columns_headers
  end

  def write_years_headers
    parent_groups.each_with_index do |year, index|
      start_index = start_index_header(year, index)
      write_year_header(start_index, year)
    end

    self.current_row += 1
  end

  def write_week_headers
    groups.keys.each_with_index do |group, index|
      start_index = start_index_header(group, index)
      write_week_header(start_index, group)
    end

    self.current_row += 1
  end

  def write_week_header(start_index, group)
    translated_group = translate_group(group)
    if subitems_size == 1
      worksheet.write(current_row, start_index, translated_group, formats[:bold_blue])
    else
      worksheet.merge_range(
        current_row, start_index,
        current_row, start_index + subitems_size - 1,
        translated_group, formats[:bold_blue_align]
      )
    end
  end

  def write_year_header(start_index, year)
    if subitems_size == 1
      worksheet.write(current_row, start_index, year, formats[:bold_blue])
    else
      worksheet.merge_range(
        current_row, start_index,
        current_row, start_index + subitems_size - 1,
        year, formats[:bold_blue_align]
      )
    end
  end

  def write_groups_headers
    parent_groups.each_with_index do |group, group_index|
      start_index = start_index_header(group, group_index)
      write_group_header(start_index, group)
    end

    self.current_row += 1
  end

  def write_group_header(start_index, parent_group)
    sort_group(parent_group).each_with_index do |group, group_index|
      translated_group = translate_group(group)
      group_header_label = header_include_year? ? "#{parent_group}-#{translated_group}" : translated_group
      if subitems_size == 1
        worksheet.write(current_row, start_index + group_index, group_header_label, formats[:bold_blue])
      else
        write_group_subcolumn_header(start_index, group_index, group_header_label)
      end
    end
  end

  def write_group_subcolumn_header(start_index, group_index, group_header_label)
    worksheet.merge_range(
      current_row, calculate_position(start_index, group_index * subitems_size),
      current_row, calculate_position(start_index, ((group_index + 1) * subitems_size) - 1),
      group_header_label, formats[:bold_blue]
    )
  end

  def write_grouped_indicator_data
    grouped_data = values.group_by { |value| value['group_id'].to_s }
    parent_groups.each_with_index do |year, year_index|
      if grouped_by_year?
        write_year_data(grouped_data, year_index, year)
      else
        subcolumn_initial_index = written_subcolumns_number(year_index) + 1
        write_subcolumns_data(grouped_data, subcolumn_initial_index, year)
      end
    end

    self.current_row += indicator_options.size
  end

  def write_year_data(grouped_data, initial_index, year)
    group_data = grouped_data[year.to_s].first['data']
    write_columns_data(group_data, 1, initial_index)
  end

  def write_subcolumns_data(grouped_data, initial_index, year)
    sort_group(year).each_with_index do |group, group_index|
      group_key = grouped_by_week? ? group : "#{year}-#{group}"
      group_data = grouped_data[group_key].first['data']
      write_columns_data(group_data, initial_index, group_index)
    end
  end

  def write_columns_data(group_data, initial_index, group_index)
    indicator_options.each_with_index do |option, option_index|
      cell_format = option == indicator_options.last ? formats[:blue_bottom_border] : formats[:black]
      write_column_data(
        {
          group_data:, group_index:, option:, option_index:,
          initial_index:, cell_format:, indicator_key: key
        }
      )
    end
  end

  def write_column_data(params = {})
    if subcolumn_options.present?
      write_indicators_subcolumns_data(params)
    else
      worksheet.write(
        current_row + params[:option_index],
        params[:initial_index] + params[:group_index],
        grouped_subcolumn_total(params[:group_data], params[:option]),
        params[:cell_format]
      )
    end
  end

  def write_indicators_subcolumns_data(params)
    subcolumn_options.each_with_index do |subcolumn, subcolumn_index|
      worksheet.write(
        grouped_subcolumn_row(params[:option_index]),
        grouped_subcolumn_column(params[:initial_index], params[:group_index], subcolumn_index),
        grouped_subcolumn_value(params[:group_data], params[:option], subcolumn),
        params[:cell_format]
      )
    end
  end

  def grouped_subcolumn_row(option_index)
    calculate_position(current_row, option_index)
  end

  def grouped_subcolumn_column(initial_index, group_index, subcolumn_index)
    calculate_position(initial_index, group_index * subcolumn_options.size, subcolumn_index)
  end

  def start_index_header(group, group_index)
    columns_size = groups[group].size * subitems_size
    (group_index * (prev_column_size(group_index) || columns_size)) + 1
  end

  def prev_column_size(group_index)
    return unless group_index >= 1 && !grouped_by_week?

    groups[parent_groups[group_index - 1]].size * subitems_size
  end

  def write_sub_items_columns_headers
    return if subcolumn_options.blank?

    parent_groups.each_with_index do |parent_group, parent_group_index|
      start_index = start_index_header(parent_group, parent_group_index)

      indicators_subcolums_per_group(parent_group).each_with_index do |subcolumn, subcolumn_index|
        worksheet.write(current_row, calculate_position(start_index, subcolumn_index),
                        build_label(subcolumn), formats[:bold_blue])
      end
    end

    self.current_row += 1
  end

  def chart_width
    return GROUPED_CHART_WIDTH if columns_number < 3

    GROUPED_CHART_WIDTH + (columns_number * EXCEL_COLUMN_WIDTH)
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
    indicator_options.map.with_index do |option, option_index|
      series_data = generate_series_data(categories_row, header_row, option_index)
      {
        name: option['display_text'],
        fill: { color: colors.at(option_index) },
        categories: series_categories(series_data),
        values: series_values(series_data),
        points: [{ fill: { color: colors.at(option_index) } }]
      }
    end
  end

  def generate_series_data(categories_row, header_row, option_index)
    series_groups.each_with_object(categories: [], values: []).with_index do |(_elem, memo), group_index|
      row_value = serie_row_value(header_row, option_index)
      start_column = (subcolumn_options.size * group_index) + 1
      end_column = subcolumn_options.size * (group_index + 1)
      memo[:categories] << [categories_row, categories_row, start_column, start_column]
      memo[:values] << [row_value, row_value, end_column, end_column]
    end
  end

  def series_groups
    grouped_by_year? ? parent_groups : groups.values.flatten
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

  def options_to_series(colors, categories_row, header_row)
    indicator_options.each_with_index.map do |option, index|
      row_value = serie_row_value(header_row, index)
      end_column = serie_end_column(index)
      {
        name: option['display_text'], fill: { color: colors.at(index) },
        categories: [worksheet.name, categories_row, categories_row, 1, end_column],
        values: [worksheet.name, row_value, row_value, serie_start_column, end_column],
        points: [{ fill: { color: colors.at(index) } }]
      }
    end
  end

  def serie_start_column
    subcolumn_options.present? ? subcolumn_options.size : 1
  end

  def serie_end_column(index)
    end_column = subcolumn_options.present? ? subcolumn_options.size : columns_number
    subcolumn_options.present? ? subcolumn_options.size * (index + 1) : end_column
  end

  def serie_row_value(header_row, index)
    row_value = header_row + index
    row_value += 1 if subcolumn_options.present?
    row_value
  end

  def grouped_subcolumn_total(group_data, option)
    group_data.find { |elem| elem['id'] == option['id'] }&.dig('total') || 0
  end

  def grouped_subcolumn_value(group_data, option, subcolumn)
    group_option = group_data.find { |elem| elem['id'] == option['id'] }
    subcolumn_value(group_option, subcolumn)
  end

  def written_subcolumns_number(column_index)
    column_index.times.each_with_index.reduce(0) do |acc, (_, index)|
      acc + (groups[parent_groups[index]].size * (subcolumn_options&.size || 1))
    end
  end

  def sort_group(group)
    elems = groups[group]
    return elems if grouped_by_week?
    return elems.sort { |group1, group2| group1.to_i <=> group2.to_i } if grouped_by_month?

    elems.sort { |group1, group2| group1.last.to_i <=> group2.last.to_i }
  end

  def total_subcolumn?
    values.any? { |group| group['data'].any? { |elem| elem.key?('total') } }
  end

  def translate_group(group)
    return group unless grouped_by_month? || grouped_by_week?
    return translate_week(group) if grouped_by_week?

    I18n.l(DateTime.new(DateTime.now.year, group.to_i, 1), format: '%b', locale: date_locale)
  end

  def translate_week(week)
    start_date, end_date = week.split(' - ')
    start_date = I18n.l(Date.parse(start_date), format: '%Y-%b-%d', locale: date_locale)
    end_date = I18n.l(Date.parse(end_date), format: '%Y-%b-%d', locale: date_locale)
    "#{start_date} - #{end_date}"
  end

  def indicators_subcolums_per_group(year)
    subcolumn_options * groups[year]&.size
  end

  def grouped_by_month?
    grouped_by.value == GROUPED_BY[:month]
  end

  def grouped_by_year?
    grouped_by.value == GROUPED_BY[:year]
  end

  def grouped_by_week?
    grouped_by.value == GROUPED_BY[:week]
  end

  def header_include_year?
    true
  end
end
# rubocop:enable Metrics/ClassLength
