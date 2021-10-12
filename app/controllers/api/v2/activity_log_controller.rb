# frozen_string_literal: true

# API to fetch the list of activities
class Api::V2::ActivityLogController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    # TODO: Can all dashboards be returned in a single request?
    # authorize! "dash_activity_log_#{activity_type}".to_sym, Dashboard
    results = ActivityLog.list(current_user, activity_type)
    @total = results.size
    @activity_logs = results.paginate(pagination)
  end

  def default_sort_field
    'datetime'
  end

  def activity_type
    @activity_type ||= params[:type]
  end
end
