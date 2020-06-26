# frozen_string_literal: true

module Api::V2
  # Controller for the reports
  class ReportsController < ApplicationApiController
    include Concerns::Pagination
    before_action :load_report, only: %i[show update destroy]

    def index
      authorize! :index, Report
      reports = Report.where(module_id: current_user.modules.map(&:unique_id))
      @total = reports.size
      @reports = reports.paginate(pagination)
    end

    def show
      authorize! :read_reports, @report
      @report.permission_filter = report_permission_filter(current_user)
      @report.build_report
    end

    def create
      authorize! :create, Report
      @report = Report.new_with_properties(report_params)
      @report.save!
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
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
        :record_type, :module_id, :graph, :aggregate_counts_from, :group_ages, :group_dates_by, :add_default_filters,
        name: {}, description: {}, fields: [:name, position: {}], filters: [[:attribute, :constraint, value: []], [:attribute, :constraint, :value]]
      )
    end

    protected

    def load_report
      @report = Report.find(params[:id])
    end

    private

    def report_permission_filter(user)
      { 'attribute' => 'owned_by_groups', 'value' => user.user_group_ids } unless can?(:read, @report)
    end
  end
end
