# frozen_string_literal: true

# A factory for instantiating BulkExports from the API params and enqueueing bulk export jobs.
class ExportService
  class << self
    def build(params, user)
      return unless params[:format] && params[:record_type]

      # TODO: Destringify the params?
      export = bulk_export_class(params[:format]).new(params.except(:password))
      export.owner = user
      export
    end

    def bulk_export_class(format)
      if format == Exporters::DuplicateIdCSVExporter.id
        DuplicateBulkExport
      else
        BulkExport
      end
    end

    def enqueue(bulk_export, password)
      return log_missing_password(bulk_export) unless password

      encrypted_password = EncryptionService.encrypt(password)
      BulkExportJob.perform_later(bulk_export.id, encrypted_password)
    end

    def log_missing_password(bulk_export)
      Rails.logger.error("No password submitted to enqueue the BulkExport #{bulk_export.id}")
    end
  end
end