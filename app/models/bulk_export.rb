# frozen_string_literal: true

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

  def export(password)
    process_records_in_batches(500) do |records_batch|
      exporter.export(records_batch, owner, custom_export_params || {})
    end
    exporter.complete
    zipped_file = ZipService.zip(stored_file_name, password)
    attach_export_file(zipped_file)
    mark_completed!
  end

  def model_class
    @model_class ||= Record.model_from_name(record_type)
  end

  def exporter_type
    @exporter_type ||= ExportService.exporter(model_class, format)
  end

  def exporter
    @exporter ||= exporter_type.new(stored_file_name)
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
    return if file_name.present?

    self.file_name = "#{record_type&.pluralize}-#{Time.now.strftime('%Y%m%d.%M%S%M%L')}.#{exporter_type&.mime_type}"
  end

  def stored_file_name
    return unless file_name.present?

    File.join(Rails.configuration.exports_directory, "#{id}_#{file_name}")
  end

  def url
    Rails.application.routes.url_helpers.rails_blob_path(export_file, only_path: true, expires_in: EXPIRES)
  end

  def process_records_in_batches(batch_size = 500, &block)
    # TODO: This is a good candidate for multi-threading, provided export buffers are thread safe.
    pagination = { page: 1, per_page: batch_size }
    order = self.order || { created_at: :desc }
    begin
      search = SearchService.search(
        model_class, search_filters, record_query_scope, query, order, pagination
      )
      results = search.results
      yield(results)
      # Set again the values of the pagination variable because the method modified the variable.
      pagination[:page] = results.next_page
      pagination[:per_page] = batch_size
    end until results.next_page.nil?
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
