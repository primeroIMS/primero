# frozen_string_literal: true

# Concern for Cases Transition Subreport Exporter
class Exporters::CasesTransitionSubreportExporter < Exporters::SubreportExporter
  include Exporters::Concerns::RecordFilterInsightParams

  def params_list
    view_by_param +  date_range_values_param + filter_by_date_param + status_param +
      by_param + user_group_param + agency_param + referral_transfer_status_param
  end

  def referral_transfer_status_param
    return [] unless referral_transfer_status_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.referral_transfer_status', locale:)}: ",
      formats[:black], referral_transfer_status_text
    ]
  end

  def referral_transfer_status_text
    filter = referral_transfer_status_filter
    return unless filter.present?

    referral_transfer_status_filter.values.map do |value|
      I18n.t("managed_reports.referral_transfer_status_options.#{value}")
    end.join(', ')
  end

  def referral_transfer_status_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'referral_transfer_status' }
  end
end
