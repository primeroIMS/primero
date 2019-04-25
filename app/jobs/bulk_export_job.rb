class BulkExportJob < ApplicationJob
  queue_as :export

  def perform(bulk_export_id, opts={})
    bulk_export = BulkExport.find_by(id: bulk_export_id) #We are Rails 4.0 and don't use GlobalId yet
    if bulk_export.present?
      user = bulk_export.owner
      record_modules = user.modules_for_record_type(bulk_export.record_type)
      permitted_fields = user.permitted_fields(record_modules, bulk_export.record_type, true)
      options = bulk_export.custom_export_params
      exporter = bulk_export.exporter_type.new(bulk_export.stored_file_name)

      bulk_export.process_records_in_batches(500) do |records_batch|
        exporter.export(records_batch, permitted_fields, user, options)
      end

      exporter.complete

      bulk_export.encrypt_export_file

      bulk_export.mark_completed
    else
      Rails.logger.warn("BulkExport Id: #{bulk_export_id} was not found. Skipping...")
    end
  end
end
