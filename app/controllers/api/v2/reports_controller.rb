module Api::V2
  class ReportsController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, Report
      reports = Report.where(module_id: current_user.modules.map(&:unique_id))
      @total = reports.size
      @reports = reports.paginate(pagination)
    end

    def show
      @report = Report.find(params[:id])
      authorize! :read_reports, @report
      @report.permission_filter = report_permission_filter(current_user)
      @report.build_report
    end

    def create
      authorize! :create, Report
      @report = Report.new_with_properties(report_params)
      @report.save
      @report.permission_filter = report_permission_filter(current_user)
      @report.build_report
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      @report = Report.find(params[:id])
      authorize! :update, @report
      @report.update_properties(report_params)
      @report.save
      @report.permission_filter = report_permission_filter(current_user)
      @report.build_report
    end

    def destroy
      @report = Report.find(params[:id])
      authorize! :destroy, @report
      @report.destroy!
    end

    def report_params
      params.require(:data).permit(
        :record_type, :module_id, :graph, :aggregate_counts_from, :group_ages, :group_dates_by, :add_default_filters,
        disaggregate_by: [], aggregate_by: [], name: {}, description: {}, fields: [:name, position: {}],
        filters: [:attribute, :constraint, value: []]
      )
    end

    private

    def report_permission_filter(user)
      unless can?(:read, @report)
        { "attribute" => "owned_by_groups", "value" => user.user_group_ids }
      end
    end
  end
end