# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Exporter for CaseManagementKpiSubreportExporter
class Exporters::CaseManagementKpiSubreportExporter < Exporters::SubreportExporter
  include Exporters::Concerns::InsightParams

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param +
      protection_concerns_param + age_param
  end

  def protection_concerns_param
    return [] unless protection_concerns_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.protection_concerns', locale:)}: ",
      formats[:black], "#{protection_concerns_text} / "
    ]
  end

  def age_param
    return [] unless age_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.age', locale:)}: ",
      formats[:black], age_text
    ]
  end

  def protection_concerns_text
    filter = protection_concerns_filter
    return unless filter.present?

    lookup_values_i18n = Lookup.find_by(unique_id: 'lookup-protection-concerns')&.lookup_values_i18n

    protection_concerns_filter.values.map do |value|
      lookup_values_i18n.find { |lookup_value| lookup_value['id'] == value }&.dig('display_text', locale)
    end.join(', ')
  end

  def age_text
    filter = age_filter
    return unless filter.present?

    "#{filter.from} - #{filter.to}"
  end

  def protection_concerns_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'protection_concerns' }
  end

  def age_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'age' }
  end
end
