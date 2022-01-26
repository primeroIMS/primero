# frozen_string_literal: true

# ManagedReports CRUD API
class Api::V2::ManagedReportsController < ApplicationApiController
  before_action :load_report, only: %i[show]

  def index
    @managed_reports = current_user.role.managed_reports
    @total = @managed_reports.size
  end

  def show
    @managed_report.build_report(filters, params[:subreport])
  end

  protected

  def load_report
    authorize_managed_reports_read!

    @managed_report = ManagedReport::REPORTS[params[:id]]
  end

  private

  def authorize_managed_reports_read!
    raise Errors::InvalidPrimeroEntityType unless Permission::RESOURCE_ACTIONS['managed_report'].include?(params[:id])

    raise Errors::ForbiddenOperation unless current_user.role.managed_reports_permissions_actions.include?(params[:id])
  end

  def permit_params
    params.permit(
      :id, :subreport, :ctfmr_verified, :verified_ctfmr_technical,
      date_of_first_report: {}, incident_date: {}
    )
  end

  def filters
    SearchFilterService.build_filters(
      permit_params,
      %w[
        date_of_first_report incident_date
        ctfmr_verified verified_ctfmr_technical
      ]
    )
  end
end
