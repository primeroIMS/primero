class DuplicateBulkExportJob < ApplicationJob
  queue_as :export

  # TODO: Tried to make this dry by extending BulkExportJob, but something is causing a race
  # condition between `exporter.complete` and when the export is zip/encrypted. When `encrypt_export_file`
  # is called the logic that zip/encrypted thinks the exported file size is 0.
  def perform(bulk_export_id, opts={})
    bulk_export = DuplicateBulkExport.find_by(id: bulk_export_id)

    user = bulk_export.owner
    options = bulk_export.custom_export_params
    exporter = bulk_export.exporter_type.new(bulk_export.stored_file_name)
    permitted_properties = exporter.class.permitted_fields_to_export(user, bulk_export.record_type)

    sys = SystemSettings.current
    duplicate_export_field = sys.duplicate_export_field

    if duplicate_export_field.present?
      bulk_export.process_records_in_batches(100, 500, duplicate_export_field) do |records_batch|
        exporter.export(records_batch, permitted_properties, user, options)
      end

      exporter.complete

      bulk_export.encrypt_export_file

      bulk_export.mark_completed
    else
      bulk_export.mark_terminated
      Rails.logger.error "Duplicate export field not found in system settings"
    end
  end
end