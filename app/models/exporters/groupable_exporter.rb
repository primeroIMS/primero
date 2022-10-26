# frozen_string_literal: true

# Methods for groupable exporters
# rubocop:disable Metrics/ModuleLength
module Exporters::GroupableExporter
  extend ActiveSupport::Concern

  GROUPED_CHART_WIDTH = 566

  GROUPED_BY = {
    month: 'month',
    year: 'year',
    quarter: 'quarter'
  }.freeze

  def grouped_by_param
    self.grouped_by = managed_report.filters.find { |filter| filter.field_name == 'grouped_by' }
    grouped_by
  end

  def build_groups
    return unless grouped_by_param.present?

    self.groups = data_groups
    self.years = groups.keys.sort { |year1, year2| year1.to_i <=> year2.to_i }
  end

  def groups_list
    groups = data.except(:lookup).values.find(&:present?)
    return [] unless groups.present?

    groups.map { |group| group[:group_id].to_s.split('-') }
  end

  def data_groups
    groups_list.reduce({}) do |acc, elem|
      next(acc.merge(elem.first => [elem.last])) unless acc[elem.first].present?

      acc.merge(elem.first => acc[elem.first] + [elem.last])
    end
  end

  def indicators_subcolumns_data(indicator_key)
    indicators_subcolumns[indicator_key] || []
  end

  def write_grouped_headers(indicator_key = nil)
    sub_item_size = indicators_subcolumns[indicator_key]&.size || 1
    if grouped_by_year?
      write_years_headers(sub_item_size)
    else
      write_groups_headers(sub_item_size)
    end
    write_sub_items_columns_headers(indicator_key)
  end

  def columns_number
    columns = groups&.values&.reduce(0) { |acc, val| acc + val.size }
    return 1 unless columns.present? && columns.positive?

    columns
  end

  def write_grey_row
    worksheet.merge_range(current_row, 0, current_row, columns_number, '', formats[:grey_space])
    self.current_row += 1
  end

  def write_grouped_table_header(indicator_key)
    write_grey_row

    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, columns_number * (indicators_subcolumns[indicator_key]&.size || 1),
      build_label(indicator_key),
      formats[:blue_header]
    )

    self.current_row += 1
  end

  def write_years_headers(sub_item_size = 1)
    years.each_with_index do |year, index|
      start_index = start_index_header(year, index, sub_item_size)
      write_year_header(start_index, year, sub_item_size)
    end

    self.current_row += 1
  end

  def write_year_header(start_index, year, sub_item_size)
    if sub_item_size == 1
      worksheet.write(current_row, start_index, year, formats[:bold_blue])
    else
      worksheet.merge_range(
        current_row, start_index,
        current_row, start_index + sub_item_size - 1,
        year, formats[:bold_blue_align]
      )
    end
  end

  def start_index_header(year, year_index, sub_item_size)
    columns_size = groups[year].size * sub_item_size
    prev_column_size = groups[years[year_index - 1]].size * sub_item_size if year_index >= 1

    year_index * (prev_column_size || columns_size) + 1
  end

  def write_groups_headers(sub_item_size = 1)
    years.each_with_index do |year, year_index|
      start_index = start_index_header(year, year_index, sub_item_size)
      write_group_header(start_index, year, sub_item_size)
    end

    self.current_row += 1
  end

  def write_group_header(start_index, year, subitems_size)
    sort_group(year).each_with_index do |group, group_index|
      translated_group = translate_group(group)
      group_header_label = header_include_year? ? "#{year}-#{translated_group}" : translated_group
      if subitems_size == 1
        worksheet.write(current_row, start_index + group_index, group_header_label, formats[:bold_blue])
        next
      end

      worksheet.merge_range(current_row, calculate_position(start_index, (group_index * subitems_size)),
                            current_row, calculate_position(start_index, (((group_index + 1) * subitems_size) - 1)),
                            group_header_label, formats[:bold_blue])
    end
  end

  def write_sub_items_columns_headers(indicator_key = nil)
    indicators_subcolumns_keys = indicators_subcolumns_data(indicator_key)
    return if indicators_subcolumns_keys.blank?

    years.each_with_index do |year, year_index|
      start_index = start_index_header(year, year_index, indicators_subcolumns_keys.size)

      indicators_subcolums_per_group(year, indicator_key).each_with_index do |subcolumn, subcolumn_index|
        worksheet.write(current_row, calculate_position(start_index, subcolumn_index),
                        build_label(subcolumn), formats[:bold_blue])
      end
    end

    self.current_row += 1
  end

  def translate_group(group)
    return group unless grouped_by_month?

    date_locale = locale.blank? || I18n.available_locales.exclude?(locale.to_sym) ? I18n.default_locale.to_s : locale

    I18n.l(DateTime.new(DateTime.now.year, group.to_i, 1), format: '%b', locale: date_locale)
  end

  def write_grouped_indicator(indicator_key, indicator_values)
    indicator_lookups = lookups[indicator_key]
    write_grouped_table_header(indicator_key)
    return if indicator_values.blank?

    write_grouped_headers(indicator_key)
    options = sort_options(indicator_options(indicator_values), indicator_lookups, indicator_key == 'age')
    options_display_text(options, indicator_lookups)
    write_indicator_options(options)
    write_grouped_indicator_data(indicator_values, options, indicator_key)
    write_grouped_graph(options) unless indicators_subcolumns_data(indicator_key).present?
  end

  def write_grouped_graph(options)
    return unless options.present?

    chart = workbook.add_chart(type: 'column', embedded: 1, name: '')
    series = build_group_series(options)
    series.each { |serie| chart.add_series(serie) }
    chart.set_size(height: Exporters::SubreportExporter::INITIAL_CHART_HEIGHT, width: grouped_chart_width)
    chart.set_y_axis(major_unit: 1)
    worksheet.insert_chart(current_row, 0, chart, 0, 0)

    self.current_row += (
      Exporters::SubreportExporter::INITIAL_CHART_HEIGHT / Exporters::SubreportExporter::EXCEL_ROW_HEIGHT
    )
  end

  def grouped_chart_width
    return GROUPED_CHART_WIDTH if columns_number < 3

    GROUPED_CHART_WIDTH + (columns_number * Exporters::SubreportExporter::EXCEL_COLUMN_WIDTH)
  end

  def build_group_series(options)
    colors = Exporters::ManagedReportExporter::CHART_COLORS.values
    header_row = current_row - options.size
    categories_row = header_row - 1
    options_to_series(options, colors, categories_row, header_row)
  end

  def options_to_series(options, colors, categories_row, header_row)
    options.each_with_index.map do |option, index|
      row_value = header_row + index
      {
        name: option['display_text'],
        categories: [worksheet.name, categories_row, categories_row, 1, columns_number],
        values: [worksheet.name, row_value, row_value, 1, columns_number],
        points: [{ fill: { color: colors.at(index) } }]
      }
    end
  end

  def indicator_options(indicator_values)
    indicator_values.map { |elem| elem['data'] }.flatten.uniq { |elem| elem['id'] }
  end

  def sort_options(options, indicator_lookups, use_age_ranges = false)
    return sort_options_by_age_range(options) if use_age_ranges
    return options if indicator_lookups.blank? || indicator_lookups.is_a?(LocationService)

    options.sort_by do |option|
      indicator_lookups.find_index { |lookup_value| lookup_value['id'] == option['id'] } || indicator_lookups.size
    end
  end

  def sort_options_by_age_range(options)
    age_ranges = SystemSettings.primary_age_ranges.map do |age_range|
      next("#{age_range.first}+") if age_range.last >= 999

      "#{age_range.first} - #{age_range.last}"
    end
    options.sort_by { |option| age_ranges.find_index { |age_range| option['id'] == age_range } || age_ranges.size }
  end

  def options_display_text(options, indicator_lookups)
    options.each { |option| option['display_text'] = value_display_text(option, indicator_lookups) }
  end

  def write_indicator_options(options)
    display_texts = options.map { |elem| elem['display_text'] }
    display_texts.each_with_index do |display_text, index|
      cell_format = display_text != display_texts.last ? formats[:bold_black] : formats[:bold_black_blue_bottom_border]
      worksheet.write(current_row + index, 0, display_text, cell_format)
    end
  end

  def write_grouped_indicator_data(indicator_values, options, indicator_key)
    grouped_data = indicator_values.group_by { |value| value['group_id'].to_s }

    years.each_with_index do |year, year_index|
      if grouped_by_year?
        write_year_data(grouped_data, options, year_index, year, indicator_key)
      else
        subcolumn_initial_index = written_subcolumns_number(year_index, indicator_key) + 1
        write_subcolumns_data(grouped_data, options, subcolumn_initial_index, year, indicator_key)
      end
    end

    self.current_row += options.size
  end

  def write_year_data(grouped_data, options, initial_index, year, indicator_key)
    group_data = grouped_data[year.to_s].first['data']
    write_columns_data(group_data, options, 1, initial_index, indicator_key)
  end

  def write_subcolumns_data(grouped_data, options, initial_index, year, indicator_key)
    sort_group(year).each_with_index do |group, group_index|
      group_data = grouped_data["#{year}-#{group}"].first['data']
      write_columns_data(group_data, options, initial_index, group_index, indicator_key)
    end
  end

  def write_columns_data(group_data, options, initial_index, group_index, indicator_key)
    options.each_with_index do |option, option_index|
      cell_format = option != options.last ? formats[:black] : formats[:blue_bottom_border]
      write_column_data(
        {
          group_data: group_data, group_index: group_index, option: option, option_index: option_index,
          initial_index: initial_index, cell_format: cell_format, indicator_key: indicator_key
        }
      )
    end
  end

  def write_column_data(params = {})
    if indicators_subcolumns_data(params[:indicator_key]).present?
      write_indicators_subcolumns_data(params)
      return
    end

    worksheet.write(
      current_row + params[:option_index],
      params[:initial_index] + params[:group_index],
      option_total(params[:group_data], params[:option]),
      params[:cell_format]
    )
  end

  def write_indicators_subcolumns_data(params)
    subcolumns_data = indicators_subcolumns_data(params[:indicator_key])
    subcolumns_data.each_with_index do |subcolumn, subcolumn_index|
      worksheet.write(
        calculate_position(current_row, params[:option_index]),
        calculate_position(params[:initial_index], (params[:group_index] * subcolumns_data.size), subcolumn_index),
        option_value(params[:group_data], params[:option], subcolumn), params[:cell_format]
      )
    end
  end

  def option_total(group_data, option)
    group_data.find { |elem| elem['id'] == option['id'] }&.dig('total') || 0
  end

  def option_value(group_data, option, subcolumns_id)
    group_data.find { |elem| elem['id'] == option['id'] }&.dig(subcolumns_id) || 0
  end

  def written_subcolumns_number(column_index, indicator_key = nil)
    column_index.times.each_with_index.reduce(0) do |acc, (_, index)|
      acc + (groups[years[index]].size * (indicators_subcolumns[indicator_key]&.size || 1))
    end
  end

  def sort_group(year)
    return groups[year].sort { |group1, group2| group1.to_i <=> group2.to_i } if grouped_by_month?

    groups[year].sort { |group1, group2| group1.last.to_i <=> group2.last.to_i }
  end

  def grouped_by_month?
    grouped_by.value == GROUPED_BY[:month]
  end

  def grouped_by_year?
    grouped_by.value == GROUPED_BY[:year]
  end

  def build_label(label_key)
    I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{label_key}", locale: locale)
  end

  def indicators_subcolums_per_group(year, indicator_key = nil)
    indicators_subcolumns_data(indicator_key) * groups[year]&.size
  end

  def calculate_position(*args)
    args.sum
  end

  def header_include_year?
    true
  end
end
# rubocop:enable Metrics/ModuleLength
