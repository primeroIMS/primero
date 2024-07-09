# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export Grouped GHN Indicators
class Exporters::GroupedGhnIndicatorExporter < Exporters::GroupedIndicatorExporter
  attr_accessor :subreport_id

  def translate_group(group)
    group_locale = locale.blank? || I18n.available_locales.exclude?(locale.to_sym) ? I18n.default_locale.to_s : locale

    I18n.t("managed_reports.#{subreport_id}.sub_reports.#{group}", locale: group_locale)
  end

  def write_subcolumns_data(grouped_data, initial_index, year)
    sort_group(year).each_with_index do |group, group_index|
      group_data = grouped_data[group].first['data']
      write_columns_data(group_data, initial_index, group_index)
    end
  end

  def header_include_year?
    false
  end
end
