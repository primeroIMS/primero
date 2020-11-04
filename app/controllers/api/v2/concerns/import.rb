# frozen_string_literal: true

# Enpoint for triggering an import of records
module Api::V2::Concerns::Import
  extend ActiveSupport::Concern

  def import
    # The '::' is necessary so Import model does not conflict with current concern
    @import = ::Import.new(
      importer: importer, data_base64: import_params[:data_base64],
      content_type: import_params[:content_type], file_name: import_params[:file_name]
    )
    @import.run
    render 'api/v2/imports/import'
  end

  def import_params
    params.require(:data).permit(:data_base64, :content_type, :file_name)
  end
end
