# frozen_string_literal: true

# API to fetch the list of activities
class Api::V2::ActivityLogController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize :transfer, ActivityLog
    results = ActivityLog.list(current_user, activity_log_params)
    @total = results.size
    @activity_logs = results.paginate(pagination)
  end

  def default_sort_field
    'datetime'
  end

  def activity_log_params
    return @activity_log_params if @activity_log_params.present?

    permitted_params = params.permit(:type, datetime: {})

    @activity_log_params = { type: permitted_params[:type], datetime_range: datetime_range(permitted_params) }
  end

  private

  def datetime_range(permitted_params)
    from = permitted_params.dig(:datetime, :from)

    return unless from.present?

    to = permitted_params.dig(:datetime, :to)

    return Time.zone.parse(from)..Time.zone.parse(to) if to.present?

    Time.zone.parse(from)..Time.zone.now
  end
end
