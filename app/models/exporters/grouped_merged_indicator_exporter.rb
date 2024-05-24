# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export a grouped and merged Indicator
class Exporters::GroupedMergedIndicatorExporter < Exporters::GroupedIndicatorExporter
  include Exporters::MergeableIndicatorExporter

  def group_list
    groups = values.slice(*merged_indicators).values.find(&:present?)

    return [] unless groups.present?

    groups.map { |group| group[:group_id].to_s.split('-') }
  end

  def load_indicator_options; end

  def load_subcolumn_options; end

  def total_subcolumn?
    false
  end

  def write
    write_grouped_table_header
    return if values.blank?

    write_grouped_headers
    write_grouped_indicator_data
    self.current_row += 1
  end

  def write_grouped_indicator_data
    sorted_indicators = sort_merged_indicators
    sorted_indicators.each do |indicator|
      last_indicator = indicator == sorted_indicators.last
      write_merged_indicator_title(indicator, title_format(last_indicator))
      write_merged_indicator_data(group_indicator_data(indicator), cell_format(last_indicator))
      self.current_row += 1
    end
  end

  def write_merged_indicator_title(indicator, title_format)
    worksheet.write(
      current_row,
      0,
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}"),
      title_format
    )
  end

  def write_merged_indicator_data(grouped_data, cell_format)
    parent_groups.each_with_index do |parent_group, index|
      subcolumn_initial_index = written_subcolumns_number(index) + 1
      write_combined_subcolumns_data(grouped_data, subcolumn_initial_index, parent_group, cell_format)
    end
  end

  def write_combined_subcolumns_data(grouped_data, initial_index, parent_group, cell_format)
    sort_group(parent_group).each_with_index do |group, group_index|
      worksheet.write(
        current_row,
        initial_index + group_index,
        merged_indicator_total(grouped_data, parent_group, group),
        cell_format
      )
    end
  end

  def group_indicator_data(indicator)
    values[indicator].group_by { |value| value[:group_id].to_s }
  end

  def cell_format(last_indicator = false)
    return formats[:black] unless last_indicator

    formats[:blue_bottom_border]
  end

  def title_format(last_indicator = false)
    return formats[:bold_black] unless last_indicator

    formats[:bold_black_blue_bottom_border]
  end

  def sort_merged_indicators
    merged_indicators.sort_by do |indicator|
      I18n.t("managed_reports.#{managed_report.id}.sub_reports.#{indicator}")
    end
  end

  def merged_indicator_total(grouped_data, parent_group, group)
    data_key = grouped_by_year? ? parent_group : "#{parent_group}-#{group}"

    grouped_data[data_key]&.first&.dig(:data)&.first&.dig('total') || 0
  end
end
