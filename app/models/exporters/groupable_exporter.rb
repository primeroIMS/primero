# frozen_string_literal: true

# Methods for groupable exporters
module Exporters::GroupableExporter
  extend ActiveSupport::Concern

  # TODO: Should these constants be here? They are also used in the subreport exporter class
  EXCEL_ROW_HEIGHT = 20
  CHART_HEIGHT = 460

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

    splitted_group_ids = data.except(:lookup).values.first.map { |group| group[:group_id].to_s.split('-') }
    self.groups = splitted_group_ids.reduce({}) do |acc, elem|
      next(acc.merge(elem.first => [elem.last])) unless acc[elem.first].present?

      acc.merge(elem.first => acc[elem.first] + [elem.last])
    end
    self.years = groups.keys.sort { |year1, year2| year1.to_i <=> year2.to_i }
  end

  def write_grouped_headers
    if grouped_by_year?
      write_years_headers
    else
      write_groups_headers
    end
  end

  def columns_number
    groups&.values&.reduce(0) { |acc, val| acc + val.size } || 1
  end

  def write_grey_row
    worksheet.merge_range(current_row, 0, current_row, columns_number, '', formats[:grey_space])
    self.current_row += 1
  end

  def write_grouped_table_header(indicator_key)
    write_grey_row

    worksheet.set_row(current_row, 30)
    worksheet.merge_range(
      current_row, 0, current_row, columns_number,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator_key}", locale: locale),
      formats[:blue_header]
    )
    self.current_row += 1
  end

  def write_years_headers
    years.each_with_index do |year, index|
      columns_size = groups[year].size
      prev_column_size = groups[years[index - 1]].size if index >= 1
      start_index = index * (prev_column_size || columns_size)
      is_single_column = start_index + 1 == start_index + columns_size
      if !is_single_column
        worksheet.merge_range(
          current_row, start_index + 1, current_row, start_index + columns_size, year, formats[:bold_blue]
        )
      else
        worksheet.write(current_row, start_index + 1, year, formats[:bold_blue])
      end
    end

    self.current_row += 1
  end

  def write_groups_headers
    years.each_with_index do |year, year_index|
      columns_size = groups[year].size
      prev_column_size = groups[years[year_index - 1]].size if year_index >= 1
      start_index = year_index * (prev_column_size || columns_size) + 1
      sort_group(year).each_with_index do |group, group_index|
        worksheet.write(current_row, start_index + group_index, "#{year}-#{translate_group(group)}", formats[:bold_blue])
      end
    end

    self.current_row += 1
  end

  def translate_group(group)
    return group unless grouped_by_month?

    date_locale = locale.blank? || I18n.available_locales.exclude?(locale.to_sym) ? 'en' : locale

    I18n.l(DateTime.new(DateTime.now.year, group.to_i, 1), format: '%b', locale: date_locale)
  end

  def write_grouped_indicator(indicator_key, indicator_values)
    indicator_lookups = lookups[indicator_key]
    write_grouped_table_header(indicator_key)
    return if indicator_values.blank?

    write_grouped_headers
    start_row = current_row
    options = sort_options(indicator_options(indicator_values), indicator_lookups, indicator_key == 'age')
    write_indicator_options(options, indicator_lookups)
    write_grouped_indicator_data(indicator_values, options)
    last_row = current_row - 1
    write_grouped_graph([start_row, last_row])
  end

  def write_grouped_graph(table_data_rows)
    return unless table_data_rows.present?

    chart = workbook.add_chart(type: 'column', embedded: 1, name: '')
    series = grouped_by_year? ? build_year_series(table_data_rows) : build_group_series(table_data_rows)
    series.each { |serie| chart.add_series(serie) }
    chart.set_size(height: 460, width: chart_width(table_data_rows))
    # chart.set_legend(none: true)
    worksheet.insert_chart(current_row, 0, chart, 0, 0)

    self.current_row += (CHART_HEIGHT / EXCEL_ROW_HEIGHT)
  end

  def build_year_series(table_data_rows)
    years.each_with_index.map do |year, index|
      {
        name: year,
        categories: [worksheet.name] + table_data_rows + [0, 0],
        values: [worksheet.name] + table_data_rows + [index + 1, index + 1]
      }
    end
  end

  def build_group_series(table_data_rows)
    years.each_with_index.reduce([]) do |acc, (year, year_index)|
      columns_size = groups[year].size
      prev_column_size = groups[years[year_index - 1]].size if year_index >= 1
      start_index = (year_index * (prev_column_size || columns_size)) + 1
      result = acc + sort_group(year).each_with_index.map do |group, index|
        {
          name: "#{year} - #{translate_group(group)}",
          categories: [worksheet.name] + table_data_rows + [0, 0],
          values: [worksheet.name] + table_data_rows + [start_index + index, start_index + index]
        }
      end

      result.flatten
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

  def write_indicator_options(options, indicator_lookups)
    display_texts = options.map { |elem| value_display_text(elem, indicator_lookups) }
    display_texts.each_with_index do |display_text, index|
      cell_format = display_text != display_texts.last ? formats[:bold_black] : formats[:bold_black_blue_bottom_border]
      worksheet.write(current_row + index, 0, display_text, cell_format)
    end
  end

  def write_grouped_indicator_data(indicator_values, options)
    grouped_data = indicator_values.group_by { |value| value['group_id'].to_s }
    years.each_with_index do |year, year_index|
      if grouped_by_year?
        group_data = grouped_data[year.to_s].first['data']
        write_columns_data(group_data, options, 0, year_index + 1)
      else
        subcolumn_initial_index = written_subcolumns_number(year_index) + 1
        write_subcolumns_data(grouped_data, options, subcolumn_initial_index, year)
      end
    end

    self.current_row += options.size
  end

  def write_subcolumns_data(grouped_data, options, initial_index, year)
    sort_group(year).each_with_index do |group, group_index|
      group_data = grouped_data["#{year}-#{group}"].first['data']
      write_columns_data(group_data, options, initial_index, group_index)
    end
  end

  def write_columns_data(group_data, options, initial_index, group_index)
    options.each_with_index do |option, option_index|
      cell_format = option != options.last ? formats[:black] : formats[:blue_bottom_border]
      worksheet.write(
        current_row + option_index,
        initial_index + group_index,
        option_total(group_data, option),
        cell_format
      )
    end
  end

  def option_total(group_data, option)
    group_data.find { |elem| elem['id'] == option['id'] }&.dig('total') || 0
  end

  def written_subcolumns_number(column_index)
    column_index.times.each_with_index.reduce(0) { |acc, (_, index)| acc + groups[years[index]].size }
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
end
