# frozen_string_literal: true

# API to fetch the list of activities
class Api::V2::ActivityLogController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize_log_types!
    results = ActivityLog.list(current_user, activity_log_params)
    @total = results.size
    @activity_logs = results.paginate(pagination)
  end

  def default_sort_field
    'datetime'
  end

  private

  def activity_log_params
    return @activity_log_params if @activity_log_params.present?

    permitted_params = params.permit(types: [], datetime: {})

    @activity_log_params = {
      types: permitted_types(permitted_params),
      datetime_range: datetime_range(permitted_params)
    }
  end

  def permitted_types(permitted_params)
    types = permitted_params[:types] || ActivityLog.activity_types

    types.select { |type| current_user.can?(type.to_sym, ActivityLog) }
  end

  def datetime_range(permitted_params)
    from = permitted_params.dig(:datetime, :from)

    return unless from.present?

    to = permitted_params.dig(:datetime, :to)

    return Time.zone.parse(from)..Time.zone.parse(to) if to.present?

    Time.zone.parse(from)..Time.zone.now
  end

  def authorize_log_types!
    raise Errors::ForbiddenOperation unless activity_log_params[:types].present?
  end
end
