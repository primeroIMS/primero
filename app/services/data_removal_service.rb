# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service that allow users to remove data and handling referential integrity
class DataRemovalService
  RECORD_MODELS = [Child, Incident, TracingRequest].freeze
  DATA_MODELS = [
    Trace, Flag, Alert, Attachment, AuditLog, BulkExport, RecordHistory, SavedSearch, Transition, Violation,
    SearchableIdentifier
  ].freeze
  METADATA_MODELS = [
    Agency, ContactInformation, Field, FormSection, Location, Lookup, PrimeroModule, PrimeroProgram, Report, Role,
    SystemSettings, UserGroup, ExportConfiguration, PrimeroConfiguration, Webhook, IdentityProvider
  ].freeze
  # TODO: This format might be erroneous see report.rb#35
  DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:MI:SS'

  class << self
    def remove_records(args = {})
      if args.present? && args[:filters].present?
        record_models = args[:record_models].present? ? record_models_to_delete(args[:record_models]) : RECORD_MODELS
        if record_models.present?
          # TODO: We need to delete records in polymorphic models(RecordHistory, Flag, Transition, Alert, AuditLog)
          # to avoid orphan records.
          ActiveRecord::Base.transaction { record_models.each { |model| remove_model_records(model, args[:filters]) } }
        else
          puts 'No valid record model was entered. Nothing was deleted.'
        end
      else
        remove_all_records
      end
    end

    def remove_model_records(record_model, filters)
      query = apply_filters(record_model, filters)
      ModelDeletionService.new(model_class: record_model).delete_records!(query)
    end

    def remove_all_records
      ActiveRecord::Base.transaction do
        (RECORD_MODELS + DATA_MODELS).each { |model| ModelDeletionService.new(model_class: model).delete_all! }

        ActiveRecord::Base.connection.execute("DELETE FROM active_storage_attachments WHERE record_type != 'Agency'")
        agency_blob_ids = ActiveStorage::Attachment.where(record_type: 'Agency').pluck(:blob_id).join(', ')
        blobs_conditional = agency_blob_ids.present? ? "WHERE id NOT IN (#{agency_blob_ids})" : ''
        ActiveRecord::Base.connection.execute("DELETE FROM active_storage_blobs #{blobs_conditional}")
        ActiveRecord::Base.connection.execute('DELETE FROM form_sections_roles')
      end

      remove_from_solr
    end

    def remove_config(args = {})
      metadata_models = args[:include_users] == true ? [User] : []
      metadata_models += args[:metadata].present? ? metadata_models_to_delete(args[:metadata]) : METADATA_MODELS
      metadata_models.each { |model| ModelDeletionService.new(model_class: model).delete_all! }
    end

    private

    def record_models_to_delete(record_models)
      record_model_classes = model_classes(record_models)
      RECORD_MODELS.select { |record_model| record_model_classes.include?(record_model) }
    end

    def metadata_models_to_delete(metadata_models)
      metadata_model_classes = model_classes(metadata_models)
      METADATA_MODELS.select { |metadata_model| metadata_model_classes.include?(metadata_model) }
    end

    def apply_filters(model, filters)
      query = model
      filters.each do |(key, value)|
        # TODO: We only allow the created_at filter for now but once the
        # SearchService is migrated we'll use it here instead
        next unless key == :created_at && value.is_a?(Hash)

        query = from_query(query, value)
        query = to_query(query, value)
      end

      query
    end

    def from_query(query, filter)
      return query unless filter[:from].present?

      query.where(
        'to_timestamp(data->> :field, :format) > to_timestamp(:from, :format)',
        field: 'created_at', format: DATE_TIME_FORMAT, from: filter[:from]
      )
    end

    def to_query(query, filter)
      return query unless filter[:to].present?

      query.where(
        'to_timestamp(data->> :field, :format) < to_timestamp(:to, :format)',
        field: 'created_at', format: DATE_TIME_FORMAT, to: filter[:to]
      )
    end

    def model_classes(model_names)
      return [] unless model_names.present?

      model_names.map { |name| PrimeroModelService.to_model(name) }
    end

    def remove_from_solr
      return unless Rails.configuration.solr_enabled

      Sunspot.remove_all(RECORD_MODELS)
    end
  end
end
