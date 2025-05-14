# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Audit logs query API
class Api::V2::AuditLogsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :read, AuditLog
    @audit_logs = AuditLog.logs(audit_logs_filters)
    @total = @audit_logs.size
    @audit_logs = AuditLog.enrich_audit_logs(@audit_logs.paginate(pagination))
  end

  def per
    @per ||= params[:per]&.to_i || 100
  end

  def audit_logs_params
    params.permit(:user_name, :from, :to, audit_log_actions: {}, record_type: {})
  end

  protected

  def order_by
    return 'users.user_name' if %w[user_name record_user_name].include?(params[:order_by])

    super
  end

  def default_sort_field
    'timestamp'
  end

  def timestamp_param
    from_param..to_param
  end

  def from_param
    params[:from].present? ? Time.zone.parse(params[:from]) : Time.at(0).to_datetime
  end

  def to_param
    params[:to].present? ? Time.zone.parse(params[:to]) : DateTime.now.end_of_day
  end

  def audit_logs_filters
    {
      user_name: audit_logs_params[:user_name],
      actions: audit_logs_params[:audit_log_actions]&.values,
      record_types: audit_logs_params[:record_type]&.values,
      date_range: timestamp_param, order_by: order_by, order: order
    }
  end
end
