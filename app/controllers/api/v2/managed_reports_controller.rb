# frozen_string_literal: true

# ManagedReports CRUD API
class Api::V2::ManagedReportsController < ApplicationApiController
  before_action :load_report, only: %i[show]

  def index
    @managed_reports = current_user.role.managed_reports
    @total = @managed_reports.size
  end

  def show
    @managed_report.apply_filters(params) if params[:build_report] # We need to define the hash of params
    @managed_report.build_report if params[:build_report]
  end

  protected

  def load_report
    authorize_managed_reports_read!

    @managed_report = "ManagedReports::#{params[:id].camelize}".constantize.new
  end

  private

  def authorize_managed_reports_read!
    raise Errors::InvalidPrimeroEntityType unless Permission::RESOURCE_ACTIONS['managed_report'].include?(params[:id])

    raise Errors::ForbiddenOperation unless current_user.role.managed_reports_permissions_actions.include?(params[:id])
  end
end
