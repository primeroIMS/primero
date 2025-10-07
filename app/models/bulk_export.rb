# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents the asynchronous run of a queued export job.
# In Primero v2, all exports are asynchronous.
# See app/models/exporters
class BulkExport < ApplicationRecord
  PROCESSING = 'job.status.processing' # The job is still running
  TERMINATED = 'job.status.terminated' # The job terminated due to an error
  COMPLETE = 'job.status.complete'     # The job completed successfully
  ARCHIVED = 'job.status.archived'     # The job's files have been cleaned up
  ARCHIVE_CUTOFF = 30                  # days
  PASSWORD_LENGTH = 8
  EXPIRES = 60.seconds # Expiry for the delegated ActiveStorage url

  alias_attribute :export_format, :format

  scope :owned, ->(owner_user_name) { where(owned_by: owner_user_name) }
  belongs_to :owner, class_name: 'User', foreign_key: 'owned_by', primary_key: 'user_name'
  has_one_attached :export_file
  validates :owned_by, presence: true
  validates :record_type, presence: true
  validates :format, presence: true
  validates :export_file, file_size: { less_than_or_equal_to: 50.megabytes }, if: -> { export_file.attached? }
  before_save :generate_file_name

  def self.validate_password!(password)
    return unless ZipService.require_password? && password.length < PASSWORD_LENGTH

    raise(Errors::InvalidPrimeroEntityType, 'Password is too weak')
  end

  def self.api_path
    '/api/v2/exports'
  end

  def export(password)
    process_records_in_batches(500) { |records_batch| exporter.export(records_batch) }
    exporter.complete
    zipped_file = ZipService.zip(stored_file_name, password)
    attach_export_file(zipped_file)
    mark_completed!
  end

  def model_class
    @model_class ||= PrimeroModelService.to_model(record_type)
  end

  def exporter_type
    @exporter_type ||= ExportService.exporter(model_class, format)
  end

  def exporter
    return @exporter if @exporter.present?

    @exporter = exporter_type.new(
      stored_file_name,
      { record_type:, user: owner },
      custom_export_params&.with_indifferent_access || {}
    )
  end

  def search_filters
    return [] unless filters.present?
    return @search_filters if @search_filters.present?

    service = SearchFilterService.new
    @search_filters = service.build_filters(filters)
  end

  def record_query_scope
    @record_query_scope ||= owner&.record_query_scope(model_class)
  end

  def mark_started!
    self.status = PROCESSING
    self.started_on = DateTime.now
    # TODO: Log this
    save!
  end

  def mark_completed!
    self.status = COMPLETE
    self.completed_on = DateTime.now
    # TODO: Log this
    save!
  end

  def mark_terminated!
    self.status = TERMINATED
    save!
  end

  def archive!
    self.status = ARCHIVED
    export_file.purge if export_file.attached?
    save!
  end

  def generate_file_name
    return self.file_name = ActiveStorage::Filename.new(file_name).sanitized if file_name.present?

    self.file_name = "#{record_type&.pluralize}-#{Time.now.strftime('%Y%m%d.%M%S%M%L')}.#{exporter_type&.mime_type}"
  end

  def stored_file_name
    return unless file_name.present?

    File.join(Rails.configuration.exports_directory, "#{id}_#{file_name}")
  end

  def url
    Rails.application.routes.url_helpers.rails_blob_path(export_file, only_path: true, expires_in: EXPIRES)
  end

  def process_records_in_batches(batch = 500)
    # TODO: This is a good candidate for multi-threading, provided export buffers are thread safe.
    page = 1
    order = self.order || { created_at: :desc }
    loop do
      result = search_records(search_filters, batch, page, order)
      break if result.records.blank?

      exporter.single_record_export = result.total == 1
      yield(result.records)
      page += 1
    end
  end

  def search_records(filters, batch, page, order)
    PhoneticSearchService.search(
      model_class,
      {
        filters:,
        scope: record_query_scope, query:,
        sort: order, pagination: { page:, per_page: batch }
      }
    )
  end

  def attach_export_file(file)
    return unless file && File.size?(file)

    export_file.attach(
      io: File.open(file),
      filename: File.basename(file)
    )
    File.delete(file)
  end
end
