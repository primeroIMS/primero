# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for Record Workflow Subreport Exporter
class Exporters::RecordWorkflowSubreportExporter < Exporters::SubreportExporter
  include Exporters::Concerns::RecordFilterInsightParams

  def params_list
    view_by_param + date_range_param + date_range_values_param + filter_by_date_param + status_param +
      workflow_param + by_param + user_group_param + agency_param
  end

  def workflow_param
    return [] unless workflow_filter.present?

    [
      formats[:bold_blue], "#{I18n.t('managed_reports.filter_by.workflow', locale:)}: ",
      formats[:black], "#{workflow_display_text} / "
    ]
  end

  def workflow_display_text
    workflow_statuses = Child.workflow_statuses(PrimeroModule.cp)
    display_text = workflow_statuses[locale.to_sym].find do |workflow_status|
      workflow_status['id'] == workflow_filter.value
    end&.dig('display_text')

    display_text || workflow_filter.value
  end

  def workflow_filter
    managed_report.filters.find { |filter| filter.present? && filter.field_name == 'workflow' }
  end
end
