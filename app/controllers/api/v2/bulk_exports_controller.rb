# frozen_string_literal: true

module Api::V2
  # API endpoint for generating exports, in bulk or for individual records
  class BulkExportsController < ApplicationApiController
    include Api::V2::Concerns::Pagination

    def index
      authorize! :index, BulkExport
      @exports = BulkExport
                 .owned(current_user.user_name)
                 .where(export_filters)
                 .order(sort_order)
                 .paginate(pagination)
    end

    def show
      @export = BulkExport.find(params[:id])
      authorize! :read, @export
    end

    def create
      authorize! :create, BulkExport
      authorize_export!
      BulkExport.validate_password!(export_params[:password])
      @export = ExportService.build(export_params, current_user)
      @export.mark_started!
      ExportService.enqueue(@export, export_params[:password])
    end

    def destroy
      @export = BulkExport.find(params[:id])
      authorize! :destroy, @export
      @export.archive!
    end

    def default_sort_field
      'started_on'
    end

    def model_class
      BulkExport
    end

    private

    def authorize_export!
      action = "export_#{export_params[:export_format]}".to_sym
      record_model = export_params[:record_type] && Record.model_from_name(export_params[:record_type])
      authorize! action, record_model
    end

    def export_params
      @export_params ||= params.require(:data).permit(
        :record_type, :export_format,
        :order, :query, :file_name, :password,
        { custom_export_params: {} }, { filters: {} },
        :match_criteria
      )
    end

    def export_filters
      params.permit(:status, :record_type, :export_format)
            .reverse_merge(status: [BulkExport::COMPLETE, BulkExport::PROCESSING, BulkExport::TERMINATED])
    end
  end
end