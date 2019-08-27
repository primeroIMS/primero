module Api::V2
  class ReportsController < ApplicationApiController
    include Concerns::Pagination
    helper I18nFieldHelper
    helper ReportFieldHelper

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
      # Cache the original fields because they are changed after the report is built.
      @fields = {
        aggregate_by: @report.aggregate_by.deep_dup,
        disaggregate_by: @report.disaggregate_by.deep_dup
      }
      @report.build_report
    end

    private

    def report_permission_filter(user)
      unless can?(:read, @report)
        { "attribute" => "owned_by_groups", "value" => user.user_group_ids }
      end
    end
  end
end