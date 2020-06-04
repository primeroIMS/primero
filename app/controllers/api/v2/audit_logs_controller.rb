# frozen_string_literal: true

class Api::V2::AuditLogsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :read, AuditLog
    @audit_logs = AuditLog.logs(audit_logs_params[:user_name], timestamp_param)
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

  def timestamp_param
    from = params[:from].present? ? Time.zone.parse(params[:from]) : Time.at(0).to_datetime
    to = params[:to].present? ? Time.zone.parse(params[:to]) : DateTime.now.end_of_day
    from..to
  end
end
