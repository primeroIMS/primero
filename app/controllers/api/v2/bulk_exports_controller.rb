# frozen_string_literal: true

module Api::V2
  class BulkExportsController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, BulkExport
      @exports = BulkExport.owned(current_user.user_name).paginate(pagination)
    end

    def show
      @export = BulkExport.find(params[:id])
      authorize! :read, @export
    end

    def create
      authorize! :create, BulkExport
      authorize_export!
      @export = BulkExportBuilderService.build(bulk_export_params, current_user)
      @export.mark_started!
      BulkExportJob.perform_later(@export.id)
    end

    def destroy
      authorize! :destroy, BulkExport
    end

    def default_sort_field
      'started_on'
    end

    def model_class
      BulkExport
    end

    private

    def authorize_export!
      action = "export_#{params[:format]}".to_s
      record_model = params[:record_type] && Record.model_from_name(params[:record_type])
      authorize! action, record_model
    end

    def bulk_export_params
      params.require(:data).permit(
        :record_type, :format,
        :order, :query, :file_name, :password,
        { custom_export_params: {} }, { filters: {} },
        :match_criteria
      )
    end
  end
end