# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Exporter for ReferredAppropriateServiceSubreportExporter
class Exporters::ReferredAppropriateServiceSubreportExporter < Exporters::CaseManagementKpiSubreportExporter
  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param +
      service_implemented_param + age_param
  end

  def service_implemented_param
    return [] unless service_implemented_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.service_implemented', locale:)}: ",
      formats[:black], "#{service_implemented_text} / "
    ]
  end

  def service_implemented_text
    filter = service_implemented_filter
    return unless filter.present?

    lookup_values_i18n = Lookup.find_by(unique_id: 'lookup-service-implemented')&.lookup_values_i18n

    lookup_value = lookup_values_i18n.find do |lookup_value|
      lookup_value['id'] == service_implemented_filter.value
    end

    lookup_value&.dig('display_text', locale)
  end

  def service_implemented_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'service_implemented' }
  end
end
