# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API for fetching the aggregate statistics backing the dashboards
class Api::V2::DashboardsController < ApplicationApiController
  def index
    current_user.user_groups.load
    @dashboards = current_user.role.dashboards.flatten
    indicators = @dashboards.map(&:indicators).flatten
    @indicator_stats = IndicatorQueryService.query(indicators, current_user)
  end
end
