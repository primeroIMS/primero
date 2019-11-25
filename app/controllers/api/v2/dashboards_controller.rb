module Api::V2
  class DashboardsController < ApplicationApiController

    def index
      @dashboards = current_user.role.dashboards
      indicators = @dashboards.map(&:indicators).flatten
      @indicator_stats = IndicatorQueryService.query(indicators, current_user)
    end

  end
end