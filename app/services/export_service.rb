# frozen_string_literal: true

# A factory for instantiating BulkExports from the API params and enqueueing bulk export jobs.
class ExportService
  class << self
    def exporter(record_type, format)
      [
        Exporters::IncidentRecorderExporter, Exporters::CsvListViewExporter, Exporters::CsvExporter,
        Exporters::ExcelExporter, Exporters::JsonExporter, Exporters::PhotoWallExporter, Exporters::UNHCRCsvExporter,
        Exporters::DuplicateIdCsvExporter, Exporters::SelectedFieldsExcelExporter, Exporters::IncidentRecorderExporter,
        Exporters::RolePermissionsExporter
        # , Expoxrters::MRMViolationExporter
      ].find do |exporter|
        exporter.id == format.to_s && exporter.supported_models.include?(record_type)
      end
    end

    def build(params, user)
      return unless params[:export_format] && params[:record_type]

      params_hash = DestringifyService.destringify(params.except(:password).to_h, true)
      export = bulk_export_class(params[:export_format]).new(params_hash)
      export.owner = user
      export
    end

    def bulk_export_class(format)
      if format == Exporters::DuplicateIdCsvExporter.id
        DuplicateBulkExport
      else
        BulkExport
      end
    end

    def enqueue(bulk_export, password = nil)
      return log_missing_password(bulk_export) if ZipService.require_password? && password.blank?

      encrypted_password = EncryptionService.encrypt(password)
      BulkExportJob.perform_later(bulk_export.id, encrypted_password)
    end

    def log_missing_password(bulk_export)
      Rails.logger.error("No password submitted to enqueue the BulkExport #{bulk_export.id}")
    end
  end
end
