# frozen_string_literal: true

# Class to export the Incidents Subreport
class Exporters::IncidentsSubreportExporter < Exporters::SubreportExporter
  COMBINED_INDICATORS = %w[total gbv_sexual_violence gbv_previous_incidents].freeze

  def write_export
    write_header
    write_params
    write_generated_on
    if grouped_by.present?
      write_grouped_combined_table
    else
      write_combined_table
    end
    write_indicators
  end

  def write_combined_table
    write_table_header('combined')
    build_combined_data.each do |elem|
      worksheet.write(current_row, 0, elem.first, formats[:bold_black])
      worksheet.write(current_row, 1, elem.last)
      self.current_row += 1
    end
    self.current_row += 1
  end

  def write_grouped_combined_table
    write_grouped_table_header('combined')
    write_grouped_headers

    sorted_indicators = sort_combined_indicators
    sorted_indicators.each do |indicator|
      last_indicator = indicator == sorted_indicators.last
      write_combined_indicator_title(indicator, title_format(last_indicator))
      write_combined_indicator_data(group_indicator_data(indicator), cell_format(last_indicator))
      self.current_row += 1
    end

    self.current_row += 1
  end

  def group_indicator_data(indicator)
    data[indicator].group_by { |value| value[:group_id].to_s }
  end

  def cell_format(last_indicator = false)
    return formats[:black] unless last_indicator

    formats[:blue_bottom_border]
  end

  def title_format(last_indicator = false)
    return formats[:bold_black] unless last_indicator

    formats[:bold_black_blue_bottom_border]
  end

  def write_combined_indicator_title(indicator, title_format)
    worksheet.write(
      current_row,
      0,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"),
      title_format
    )
  end

  def write_combined_indicator_data(grouped_data, cell_format)
    years.each_with_index do |year, year_index|
      subcolumn_initial_index = written_subcolumns_number(year_index) + 1
      write_combined_subcolumns_data(grouped_data, subcolumn_initial_index, year, cell_format)
    end
  end

  def write_combined_subcolumns_data(grouped_data, initial_index, year, cell_format)
    sort_group(year).each_with_index do |group, group_index|
      worksheet.write(
        current_row,
        initial_index + group_index,
        combined_indicator_total(grouped_data, year, group),
        cell_format
      )
    end
  end

  def combined_indicator_total(grouped_data, year, group)
    data_key = grouped_by_year? ? year : "#{year}-#{group}"

    grouped_data[data_key]&.first&.dig(:data)&.first&.dig('total') || 0
  end

  def sort_combined_indicators
    COMBINED_INDICATORS.sort_by do |indicator|
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}")
    end
  end

  def build_combined_data
    COMBINED_INDICATORS.map do |indicator|
      [I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"), data[indicator]&.first&.dig('total')]
    end
  end

  def write_indicators
    transform_entries(data.entries).each do |(indicator_key, indicator_values)|
      next if COMBINED_INDICATORS.include?(indicator_key)

      if grouped_by.present?
        write_grouped_indicator(indicator_key, indicator_values)
      else
        write_indicator(indicator_key, indicator_values)
      end
    end
  end
end
