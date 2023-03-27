# frozen_string_literal: true

# Service that allow users to remove data and handling referential integrity
class DataRemovalService
  RECORD_MODELS = [Child, Incident, TracingRequest, Trace, Flag].freeze
  DATA_CONFIG = [Alert, Attachment, AuditLog, BulkExport, RecordHistory, SavedSearch, Transition].freeze
  METADATA_MODELS = [
    Agency, ContactInformation, Field, FormSection, Location, Lookup, PrimeroModule, PrimeroProgram, Report, Role,
    SystemSettings, UserGroup, ExportConfiguration, PrimeroConfiguration, Webhook, IdentityProvider
  ].freeze

  class << self
    def remove_records(args = {})
      if args.present?
        if args[:model_class].present?
        end

        if args[:filters].present?
        end
      else
        # TODO: Delete everything
      end
    end

    def remove_config(args = {})
      # TODO: Include users?
      if args[:metadata].present?
        args[:metadata].map { |m| Kernel.const_get(m) }.each do |model|
          ModelDeletionService.new(model_class: model).delete!
        end
      else
        METADATA_MODELS.each { |model| ModelDeletionService.new(model_class: model).delete_all! }
      end
    end
  end
end
