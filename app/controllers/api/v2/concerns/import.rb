# frozen_string_literal: true

# Enpoint for triggering an import of records
module Api::V2::Concerns::Import
  extend ActiveSupport::Concern

  included do
    include Api::V2::Concerns::JsonValidateParams
  end

  def import
    authorize!(:import, model_class) && validate_json!(import_field_schema, import_params)

    # The '::' is necessary so Import model does not conflict with current concern
    @import = ::Import.new(
      importer: importer, data_base64: import_params[:data_base64],
      content_type: import_params[:content_type], file_name: import_params[:file_name]
    )
    @import.run
    status = @import.status == ::Import::SUCCESS ? 200 : 422
    render 'api/v2/imports/import', status: status
  end

  def import_field_schema
    ::Import::IMPORT_FIELDS_SCHEMA
  end

  def import_params
    @import_params ||= params.require(:data).permit(:data_base64, :content_type, :file_name)
  end
end
