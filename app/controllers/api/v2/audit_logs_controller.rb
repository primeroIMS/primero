# frozen_string_literal: true

class Api::V2::AuditLogsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :read, AuditLog
    @audit_logs = AuditLog.for_user(audit_logs_params[:user_name], timestamp_param)
    @total = @audit_logs.size
    @audit_logs = @audit_logs.paginate(pagination)
  end

  def per
    @per ||= (params[:per]&.to_i || 100)
  end

  def audit_logs_params
    params.permit(:user_name, timestamp: {})
  end

  protected

  def timestamp_param
    range = DestringifyService.destringify(audit_logs_params[:timestamp].to_h)
    (range['from'] || Time.at(0).to_datetime)..(range['to'] || DateTime.now.end_of_day)
  end
end
