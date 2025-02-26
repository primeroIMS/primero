# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoint for generating usage reports
class Api::V2::UsageReportsController < ActionController::Base
  def create
    authorize! :create, UsageReport
    @export = UsageReportService.build(export_params, current_user)
    @export.mark_started!
    kpi_params = { 'start_date' => export_params[:selected_from_date], 'end_date' => export_params[:selected_to_date] }
    UsageReportService.enqueue(@export, export_params[:password], kpi_params)
    render :create
  end

  private

  def export_params
    @export_params ||= params.require(:data).permit(
      :record_type, :export_format,
      :order, :query, :file_name, :password, :selected_from_date, :selected_to_date,
      { custom_export_params: {} }, { filters: {} }, :match_criteria
    )
  end
end
