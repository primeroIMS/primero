# frozen_string_literal: true

# Concern for Record Violence Type Subreport Exporter
class Exporters::RecordViolenceTypeSubreportExporter < Exporters::SubreportExporter
  include Exporters::Concerns::TsfvInsightParams

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param + status_param +
      violence_type_param + by_param + user_group_param + agency_param
  end

  def violence_type_param
    return [] unless violence_type_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.cp_incident_violence_type', locale: locale)}: ",
      formats[:black], "#{violence_type_display_text} / "
    ]
  end

  def violence_type_display_text
    filter = violence_type_filter
    return unless filter.present?

    Lookup.values(
      'lookup-gbv-sexual-violence-type', nil, { locale: locale }
    ).find { |elem| elem['id'] == filter.value }&.dig('display_text')
  end

  def violence_type_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'cp_incident_violence_type' }
  end
end
