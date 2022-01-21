# frozen_string_literal: true

# ManagedReports CRUD API
class Api::V2::ManagedReportsController < ApplicationApiController
  before_action :load_report, only: %i[show]
  before_action :permit_fields

  def index
    @managed_reports = current_user.role.managed_reports
    @total = @managed_reports.size
  end

  def show
    @managed_report.build_subreport(filters, params[:subreport])
  end

  protected

  def load_report
    authorize_managed_reports_read!

    @managed_report = "ManagedReports::#{params[:id].camelize}".constantize.new
  end

  def filters
    SearchFilterService.build_filters(managed_reports_params, @permitted_field_names)
  end

  private

  def authorize_managed_reports_read!
    raise Errors::InvalidPrimeroEntityType unless Permission::RESOURCE_ACTIONS['managed_report'].include?(params[:id])

    raise Errors::ForbiddenOperation unless current_user.role.managed_reports_permissions_actions.include?(params[:id])
  end

  def permit_fields
    @permitted_field_names = %w[date_of_first_report date_of_incident ctfmr_verified verified_ctfmr_technical]
  end

  def managed_reports_params
    {
      'date_of_first_report' => params[:date_of_first_report] || default_date_range,
      'date_of_incident' => params[:date_of_first_report] || default_date_range,
      'ctfmr_verified' => params[:ctfmr_verified] || 'verified',
      'verified_ctfmr_technical' => params[:ctfmr_verified] || 'verified'
    }
  end

  def default_date_range
    {
      'from' => DateTime.now.beginning_of_day,
      'to' => DateTime.now.end_of_day
    }
  end
end
