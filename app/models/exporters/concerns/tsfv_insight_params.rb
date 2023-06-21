# frozen_string_literal: true

# Concern that handles TSFV Insight Params
module Exporters::Concerns::TsfvInsightParams
  extend ActiveSupport::Concern

  USER_GROUP_FIELD_NAMES = %w[created_by_groups owned_by_groups].freeze
  AGENCY_FIELD_NAMES = %w[created_organization owned_by_agency_id].freeze

  def params_list
    status_param + by_param + user_group_param + agency_param
  end

  def status_param
    return [] unless status_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.status', locale: locale)}: ",
      formats[:black], "#{status_display_text} / "
    ]
  end

  def user_group_param
    return [] unless record_field_filter.present? && USER_GROUP_FIELD_NAMES.include?(record_field_filter.field_name)

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.user_group', locale: locale)}: ",
      formats[:black], user_group_display_text
    ]
  end

  def agency_param
    return [] unless record_field_filter.present? && AGENCY_FIELD_NAMES.include?(record_field_filter.field_name)

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.agency', locale: locale)}: ",
      formats[:black], agency_display_text
    ]
  end

  def by_param
    return [] unless by_filter.present?

    [
      formats[:bold_blue],
      "#{I18n.t('managed_reports.filter_by.by', locale: locale)}: ",
      formats[:black],
      "#{I18n.t("managed_reports.by_options.#{by_filter.value}", locale: locale)} / "
    ]
  end

  def status_display_text
    filter = status_filter
    return unless filter.present?

    lookup_values = Lookup.values(
      'lookup-case-status', nil, { locale: locale }
    ).each_with_object({}) { |elem, memo| memo[elem['id']] = elem }

    filter.values.map { |value| lookup_values.dig(value, 'display_text') || value }.join(',')
  end

  def user_group_display_text
    return unless record_field_filter.present?

    UserGroup.find_by(unique_id: record_field_filter.value)&.name || record_field_filter.value
  end

  def agency_display_text
    return unless record_field_filter.present?

    Agency.find_by(unique_id: record_field_filter.value)&.name || record_field_filter.value
  end

  def status_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'status' }
  end

  def by_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'by' }
  end

  def record_field_filter
    return unless by_filter.present?

    managed_report.filters.find { |filter| filter.present? && filter.field_name == by_filter.value }
  end
end
