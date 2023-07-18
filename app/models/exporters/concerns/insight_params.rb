# frozen_string_literal: true

# Concern of Insight Params
module Exporters::Concerns::InsightParams
  extend ActiveSupport::Concern

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param + verification_status_param
  end

  def view_by_param
    return [] unless grouped_by_param.present?

    [
      formats[:bold_blue], "#{I18n.t('fields.date_range.view_by', locale: locale)}: ",
      formats[:black], "#{I18n.t("managed_reports.date_range.#{grouped_by_param.value}", locale: locale)} / "
    ]
  end

  def date_range_param
    return [] unless date_range_display_text.present?

    [
      formats[:bold_blue], "#{I18n.t('fields.date_range_field', locale: locale)}: ",
      formats[:black], "#{date_range_display_text} / "
    ]
  end

  def date_range_values_param
    return [] unless managed_report.date_range_value.blank?

    custom_date_value(:from) + custom_date_value(:to)
  end

  def custom_date_value(date_value)
    value = managed_report.date_range_filter&.send(date_value)
    return [] if value.blank?

    [
      formats[:bold_blue], "#{I18n.t("fields.date_range.#{date_value}", locale: locale)}: ",
      formats[:black], "#{value} / "
    ]
  end

  def filter_by_date_param
    return [] unless date_display_text.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.date', locale: locale)}: ",
      formats[:black], "#{date_display_text} / "
    ]
  end

  def verification_status_param
    return [] unless verification_display_text.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.verification_status', locale: locale)}: ",
      formats[:black], verification_display_text
    ]
  end

  def grouped_by_param
    self.grouped_by = managed_report.filters.find { |filter| filter && filter.field_name == 'grouped_by' }

    grouped_by
  end

  def date_display_text
    date_field_name = managed_report.date_field_name

    return unless date_field_name.present?

    I18n.t("managed_reports.#{managed_report.id}.filter_options.#{date_field_name}", locale: locale)
  end

  def date_range_display_text
    date_range_value = managed_report.date_range_value

    return I18n.t('managed_reports.date_range_options.custom', locale: locale) unless date_range_value.present?

    I18n.t("managed_reports.date_range_options.#{date_range_value}", locale: locale)
  end

  def verification_display_text
    verified_value = managed_report.verified_value

    return unless verified_value.present? && verified_value == 'verified'

    I18n.t('managed_reports.violations.filter_options.verified', locale: locale)
  end
end
