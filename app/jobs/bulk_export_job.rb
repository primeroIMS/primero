# frozen_string_literal: true

# Executes a bulk export
class BulkExportJob < ApplicationJob
  queue_as :export

  def perform(bulk_export_id, encrypted_password)
    return log_bulk_export_missing(bulk_export_id) if bulk_export(bulk_export_id).blank?

    password = EncryptionService.decrypt(encrypted_password)
    bulk_export(bulk_export_id).export(password)
    # TODO: Just testing...
    exported = @bulk_exporter.exporter.buffer.string
    csv_stuff = CSV.parse(exported)
    binding.pry
    x=0
  rescue Errors::MisconfiguredEncryptionError => e
    log_encryption_error(bulk_export_id, e)
  end

  def log_bulk_export_missing(id)
    Rails.logger.warn("BulkExport Id: #{id} was not found. Skipping...")
  end

  def log_encryption_error(id, error)
    Rails.logger.error(
      "BulkExport Id: #{id} could not be enqueued because the password could not be decrypted!" \
      "\n#{error.backtrace}"
    )
  end

  def bulk_export(bulk_export_id)
    return @bulk_export if @bulk_export.present?

    bulk_export = BulkExport.find_by(id: bulk_export_id)
    return if bulk_export.blank?

    @bulk_export = if bulk_export.format == Exporters::DuplicateIdCSVExporter.id
                     DuplicateBulkExport.new(bulk_export.attributes)
                   else
                     bulk_export
                   end
    @bulk_export
  end
end
