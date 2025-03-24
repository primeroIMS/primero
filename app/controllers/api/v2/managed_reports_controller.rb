# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# ManagedReports CRUD API
class Api::V2::ManagedReportsController < ApplicationApiController
  include Api::V2::Concerns::Export

  before_action :build_report, only: %i[show export]

  def index
    @managed_reports = current_user.role.managed_reports
    @total = @managed_reports.size
  end

  def show; end

  protected

  def build_report
    authorize_managed_reports_read!

    @managed_report = ManagedReport.list[params[:id]]
    @managed_report.build_report(current_user, filters, { subreport_id: params[:subreport], locale: params[:locale] })
  end

  def exporter
    @managed_report.exporter
  end

  def model_class
    ManagedReport
  end

  def report
    @managed_report
  end

  def export_params
    { file_name: params[:file_name], locale: params[:locale], subreport_id: params[:subreport] }
  end

  def authorize_export!
    authorize_managed_reports_read!
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
