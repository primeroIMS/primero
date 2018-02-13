class BulkExportJob < ApplicationJob
  queue_as :export

  def perform(bulk_export_id, opts={})
    bulk_export = BulkExport.get(bulk_export_id) #We are Rails 4.0 and don't use GlobalId yet

    user = bulk_export.owner
    permitted_properties = bulk_export.permitted_properties
    options = bulk_export.custom_export_params
    exporter = bulk_export.exporter_type.new(bulk_export.stored_file_name)

    bulk_export.process_records_in_batches(500) do |records_batch|
      exporter.export(records_batch, permitted_properties, user, options)
    end

    exporter.complete

    bulk_export.encrypt_export_file

    bulk_export.mark_completed
  end




end