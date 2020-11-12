# frozen_string_literal: true

# Enpoint for triggering an export of records
module Api::V2::Concerns::Export
  extend ActiveSupport::Concern

  def export
    authorize! :export, model_class

    # The '::' is necessary so Export model does not conflict with current concern
    @export = ::Export.new(
      exporter: exporter, file_name: export_params[:file_name]
    )
    @export.run
    status = @export.status == ::Export::SUCCESS ? 200 : 422
    render 'api/v2/exports/export', status: status
  end

  def export_params
    params.permit(:file_name)
  end
end
