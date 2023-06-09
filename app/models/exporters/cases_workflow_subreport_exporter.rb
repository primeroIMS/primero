# frozen_string_literal: true

# Class to export CasesWorkflows
class Exporters::CasesWorkflowSubreportExporter < Exporters::SubreportExporter
  def status_param
    return [] unless status_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.status', locale: locale)}: ",
      formats[:black], "#{status_display_text} / "
    ]
  end

  def workflow_param
    return [] unless workflow_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.workflow', locale: locale)}: ",
      formats[:black], "#{workflow_display_text} / "
    ]
  end

  def user_group_param
    return [] unless user_group_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.user_group', locale: locale)}: ",
      formats[:black], user_group_display_text
    ]
  end

  def by_user_group_param
    return [] unless by_user_group_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.user_groups_field', locale: locale)}: ",
      formats[:black], "#{I18n.t("managed_reports.user_group_options.#{by_user_group_filter.value}", locale: locale)} / "
    ]
  end

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param + status_param +
      workflow_param + by_user_group_param + user_group_param
  end

  def status_display_text
    filter = status_filter
    return unless filter.present?

    values = Lookup.values('lookup-case-status', nil, { locale: locale }).select do |value|
      filter.values.include?(value['id'])
    end

    values.map { |value| value['display_text'] }.join(',')
  end

  def workflow_display_text
    workflow_statuses = Child.workflow_statuses([PrimeroModule.cp])
    workflow_statuses.find do |workflow_status|
      workflow_status['id'] == workflow_filter.value
    end&.dig('display_text', locale)
  end

  def user_group_display_text
    return unless user_group_filter.present?

    UserGroup.find_by(unique_id: user_group_filter.value)&.name || user_group_filter.value
  end

  def status_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'status' }
  end

  def workflow_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'workflow' }
  end

  def by_user_group_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'user_groups_field' }
  end

  def user_group_filter
    return unless by_user_group_filter.present?

    managed_report.filters.find { |filter| filter.present? && filter.field_name == by_user_group_filter.value }
  end
end
