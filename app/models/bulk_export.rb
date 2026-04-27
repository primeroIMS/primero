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

  scope :owned, ->(owner_user_name) { where(owned_by: owner_user_name) }
  belongs_to :owner, class_name: 'User', foreign_key: 'owned_by', primary_key: 'user_name'
  has_one_attached :export_file
  validates :owned_by, presence: true
  validates :record_type, presence: true
  validates :format, presence: true
  validates :export_file, file_size: { less_than_or_equal_to: 50.megabytes }, if: -> { export_file.attached? }
  before_create :generate_file_name

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
    zipped_file = ZipService.zip(temp_file_name, password, file_name)
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
      temp_file_name,
      { record_type:, user: owner },
      custom_export_params&.with_indifferent_access || {}
    )
  end

  # We really shouldn't have named a column "format" because Rails/Ruby magic reserves that name.
  # This getter/setter pair is replacing the alias_attribute that changed behavior in Rails 7.2
  def export_format
    self.format
  end

  def export_format=(format)
    self.format = format
  end

  def search_filters
    return [] unless filters.present?
    return @search_filters if @search_filters.present?

    service = SearchFilterService.new
    @search_filters = service.build_filters(created_at_filter.deep_merge(filters))
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

  def temp_file_name
    return unless file_name.present?

    @temp_file_name ||= File.join(Rails.configuration.exports_directory,
                                  "#{SecureRandom.uuid}#{File.extname(file_name)}")
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
        sort: order, pagination: { page:, per_page: batch },
        skip_attachments: exporter.skip_attachments?
      }
    )
  end

  def attach_export_file(file)
    return unless file && File.size?(file)

    zipped_file_name = zipped_file_name(file)
    export_file.attach(io: File.open(file), filename: zipped_file_name)
    File.delete(file)
    self.file_name = zipped_file_name
    # Update the file_name to match the attached file, which may have a different extension if zipped
  end

  private

  def created_at_filter
    { 'created_at' => { 'from' => Time.at(0).utc, 'to' => started_on } }
  end

  def zipped_file_name(zipped_file)
    file_name_ext = File.extname(file_name)
    zipped_file_ext = File.extname(zipped_file)
    return file_name if file_name_ext == zipped_file_ext

    "#{file_name}#{zipped_file_ext}"
  end
end
