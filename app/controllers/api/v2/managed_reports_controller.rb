# frozen_string_literal: true

# ManagedReports CRUD API
class Api::V2::ManagedReportsController < ApplicationApiController
  include Api::V2::Concerns::Export

  before_action :load_report, only: %i[show]

  def index
    @managed_reports = current_user.role.managed_reports
    @total = @managed_reports.size
  end

  def show
    @managed_report.build_report(current_user, filters, params[:subreport])
  end

  protected

  def load_report
    authorize_managed_reports_read!

    @managed_report = ManagedReport.list[params[:id]]
  end

  def exporter
    @managed_report.exporter
  end

  private

  def authorize_managed_reports_read!
    raise Errors::InvalidPrimeroEntityType unless Permission::RESOURCE_ACTIONS['managed_report'].include?(params[:id])

    raise Errors::ForbiddenOperation unless current_user.role.managed_reports_permissions_actions.include?(params[:id])
  end

  def permit_params
    params.permit(:id, :subreport, *ManagedReport.list.values.map(&:permitted_filters).flatten)
  end

  def filters
    SearchFilterService.build_filters(permit_params, @managed_report.permitted_filter_names)
  end
end
