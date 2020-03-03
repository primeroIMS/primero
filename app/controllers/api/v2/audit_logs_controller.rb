# frozen_string_literal: true

module Api::V2
  class AuditLogsController < ApplicationApiController
    include Api::V2::Concerns::Pagination

    def index
      authorize! :read, AuditLog
      @audit_logs = AuditLog.joins(:user).where(filters(audit_logs_params))
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

    def filters(filter_params)
      filters = {}
      filters['users.user_name'] = filter_params[:user_name] if filter_params[:user_name].present?
      if filter_params[:timestamp].present?
        range = DestringifyService.destringify(filter_params[:timestamp].to_h)
        filters['timestamp'] = (range['from'] || Time.at(0).to_datetime)..(range['to'] || DateTime.now.end_of_day)
      end
      filters
    end
  end
end
