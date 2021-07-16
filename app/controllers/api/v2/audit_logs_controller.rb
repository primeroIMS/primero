# frozen_string_literal: true

# Audit logs query API
class Api::V2::AuditLogsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :read, AuditLog
    @audit_logs = AuditLog.logs(audit_logs_params[:user_name], timestamp_param, order_by: order_by, order: order)
    @total = @audit_logs.size
    @audit_logs = @audit_logs.paginate(pagination)
  end

  def per
    @per ||= (params[:per]&.to_i || 100)
  end

  def audit_logs_params
    params.permit(:user_name, :from, :to)
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
end
