# frozen_string_literal: true

# Executes a bulk export
class BulkExportJob < ApplicationJob
  queue_as :export

  def perform(bulk_export_id, _opts = {})
    bulk_export = BulkExport.find_by(id: bulk_export_id)
    if bulk_export.present?
      bulk_export.export
    else
      Rails.logger.warn("BulkExport Id: #{bulk_export_id} was not found. Skipping...")
    end
  end
end
