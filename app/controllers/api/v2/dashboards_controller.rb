# frozen_string_literal: true

# API for fetching the aggregate statistics backing the dashboards
class Api::V2::DashboardsController < ApplicationApiController
  def index
    current_user.user_groups.load
    @dashboards = current_user.role.dashboards
    indicators = @dashboards.map(&:indicators).flatten
    @indicator_stats = IndicatorQueryService.query(indicators, current_user)
  end
end
