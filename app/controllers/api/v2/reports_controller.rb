# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Reports CRUD API
class Api::V2::ReportsController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  before_action :load_report, only: %i[show update destroy]

  def index
    authorize! :index, Report
    reports = Report.where(module_id: current_user.modules.map(&:unique_id))
    @total = reports.size
    @reports = reports.paginate(pagination)
  end

  def show
    authorize! :read_reports, @report
    @report.permission_filter = report_permission_filter
    @report.build_report
  end

  def create
    authorize! :create, Report
    @report = Report.new_with_properties(report_params)
    @report.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status:
  end

  def update
    authorize! :update, @report
    @report.update_properties(report_params)
    @report.save!
  end

  def destroy
    authorize! :destroy, @report
    @report.destroy!
  end

  def report_params
    params.require(:data).permit(
      :record_type, :module_id, :graph, :aggregate_counts_from, :group_ages,
      :group_dates_by, :add_default_filters, :disabled, :exclude_empty_rows,
      name: {}, description: {}, fields: [:name, { position: {} }],
      filters: [[:attribute, :constraint, { value: [] }], %i[attribute constraint value]]
    )
  end

  protected

  def load_report
    @report = Report.find(params[:id])
  end

  private

  def report_permission_filter
    return if can?(:read, @report)

    if can?(:agency_read, @report)
      { 'attribute' => 'associated_user_agencies', 'value' => [current_user.agency.unique_id] }
    else
      { 'attribute' => 'owned_by_groups', 'value' => current_user.user_group_unique_ids }
    end
  end
end
