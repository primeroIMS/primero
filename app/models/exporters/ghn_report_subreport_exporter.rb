# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to export Ghn Subreports
class Exporters::GhnReportSubreportExporter < Exporters::SubreportExporter
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def build_indicator_exporter(indicator_key, indicator_values)
    indicator_exporter_class(indicator_key, indicator_values).new(
      key: indicator_key,
      values: indicator_values,
      worksheet:,
      lookups: lookups[indicator_key],
      current_row:,
      grouped_by:,
      formats:,
      managed_report:,
      locale:,
      workbook:,
      include_zeros: managed_report.include_zeros,
      subcolumn_lookups: subcolumn_lookups[indicator_key],
      indicator_subcolumns: indicators_subcolumns[indicator_key],
      indicator_rows: metadata_property('indicators_rows')&.dig(indicator_key),
      subreport_id: id
    )
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def indicator_exporter_class(key, values)
    if values.any? { |g| g[:group_id].present? }
      Exporters::GroupedGhnIndicatorExporter
    elsif violations_indicator?(key)
      Exporters::ViolationsIndicatorExporter
    else
      Exporters::IndicatorExporter
    end
  end

  def violations_indicator?(indicator_key)
    indicator_key == ManagedReports::Indicators::MultipleViolations.id
  end

  def params_list
    view_by_param + date_range_param + date_range_values_param
  end
end
