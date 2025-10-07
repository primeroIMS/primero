# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API for fetching the aggregate statistics backing the dashboards
class Api::V2::DashboardsController < ApplicationApiController
  def index
    current_user.user_groups.load
    @dashboards = select_dashboards
    indicators = @dashboards.map(&:indicators).flatten
    @indicator_stats = IndicatorQueryService.query(indicators, current_user)
  end

  def select_dashboards
    return current_user_dashboards unless selected_dashboard_names.present?

    current_user_dashboards.select { |dashboard| selected_dashboard_names.include?(dashboard.name) }
  end

  def current_user_dashboards
    @current_user_dashboards ||= current_user.role.dashboards.flatten
  end

  def selected_dashboard_names
    @selected_dashboard_names ||= DestringifyService.destringify(params.permit(names: {}).to_h)[:names] || []
  end
end
