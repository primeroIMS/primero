# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes DistributionUsersRole subreport in Primero.
class ManagedReports::SubReports::DistributionUsersRole < ManagedReports::SubReport
  attr_accessor :usage_report

  def id
    'distribution_users_role'
  end

  def build_report(current_user, params = {})
    self.user = current_user
    self.params = params
    self.usage_report = UsageReport.new
    self.data = {
      data: { distribution_users_role: build_distribution_users_role(current_user, params) },
      metadata:
    }
  end

  def display_graph
    false
  end

  def indicators_rows
    {
      'distribution_users_role' => UserGroup.all.order(:name).map do |group|
        { id: group.unique_id, display_text: { en: group.name } }
      end + [overall_option]
    }
  end

  def indicators_subcolumns
    {
      'distribution_users_role' => Role.all.order(:name).map do |role|
        { id: role.unique_id, display_text: role.name }
      end + [{ id: 'total', display_text: I18n.t('managed_reports.total') }]
    }
  end

  def order
    %w[distribution_users_role]
  end

  def build_distribution_users_role(user, params)
    users_by_role = usage_report.build_users_by_role(user, usage_report_params(params))
    usage_report.data = { users_by_role: users_by_role }
    users_by_role.keys.map { |key| { 'id' => key }.merge(users_by_role[key]) }
  end

  def usage_report_params(params)
    {
      disabled: params['disabled']&.value,
      user_group_unique_id: params['user_group_unique_id']&.value,
      agency_unique_id: params['agency_unique_id']&.value
    }
  end

  def overall_option
    {
      id: 'overall',
      display_text: { en: I18n.t('managed_reports.distribution_users_role_report.distribution_users_role.overall') }
    }
  end
end
