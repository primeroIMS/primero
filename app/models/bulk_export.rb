# frozen_string_literal: true

# Represents the asynchronous run of a queued export job.
# In Primero v2, all exports are asynchronous.
# See app/models/exporters
class BulkExport < ApplicationRecord
  PROCESSING = 'job.status.processing' # The job is still running
  TERMINATED = 'job.status.terminated' # The job terminated due to an error
  COMPLETE = 'job.status.complete'     # The job completed successfully
  ARCHIVED = 'job.status.archived'     # The job's files have been cleaned up
  # TODO: This will change with ActiveStorage
  EXPORT_DIR = File.join(Rails.root, 'tmp', 'export')
  ARCHIVE_CUTOFF = 30.days.ago

  # TODO: This will change with ActiveStorage
  FileUtils.mkdir_p EXPORT_DIR

  scope :owned, ->(owner_user_name) { where(owned_by: owner_user_name) }

  belongs_to :owner, class_name: 'User', foreign_key: 'owned_by', primary_key: 'user_name'
  has_one_attached :export_file

  validates :owned_by, presence: true
  validates :record_type, presence: true
  validates :format, presence: true
  validates :export_file, file_size: { less_than_or_equal_to: 50.megabytes }, if: -> { export_file.attached? }

  def export
    process_records_in_batches(500) do |records_batch|
      exporter.export(records_batch, owner, custom_export_params)
    end
    exporter.complete
    encrypt_export_file
    attach_export_file
    mark_completed
  end

  def model_class
    @model_class ||= Record.model_from_name(record_type)
  end

  def exporter_type
    @exporter_type ||= Exporters.active_exporters_for_model(model_class)
                                .select { |e| e.id == format.to_s }.first
  end

  def exporter
    # TODO: This may change with ActiveStorage
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
    self.password = nil # TODO: yes yes, I know
    # TODO: Log this
    save!
  end

  def mark_terminated!
    self.status = TERMINATED
    self.password = nil
    save!
  end

  def archive
    self.status = ARCHIVED
    return unless stored_file_name.present? && File.exist?(stored_file_name)

    # TODO: Is this still relevant with ActiveStorage?
    begin
      File.delete(stored_file_name)
    rescue RuntimeError
      Rails.logger.warn("Archiving #{stored_file_name}: File missing!")
    end
  end

  def stored_file_name
    return unless file_name.present?

    File.join(EXPORT_DIR, "#{id}_#{file_name}")
  end

  def encrypted_file_name
    name = stored_file_name
    name = "#{name}.zip" if name.present?
    name
  end

  def process_records_in_batches(batch_size = 500, &block)
    # TODO: This is a good candidate for multi-threading, provided export buffers are thread safe.
    pagination = { page: 1, per_page: batch_size}
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

  def attach_export_file
    return unless stored_file_name

    export_file.attach(
      io: File.open(encrypted_file_name),
      filename: File.basename(encrypted_file_name)
    )
  end

  def encrypt_export_file
    # TODO: Add an else statement that throws an error if the file is empty!
    # TODO: This code is currently duplicated in the application controller
    # TODO: Make this ActiveStorage-compliant
    return unless stored_file_name && File.size?(stored_file_name)

    encrypt = password ? Zip::TraditionalEncrypter.new(password) : nil
    Zip::OutputStream.open(self.encrypted_file_name, encrypt) do |out|
      out.put_next_entry(File.basename(self.stored_file_name))
      out.write open(self.stored_file_name).read
    end

    File.delete self.stored_file_name
  end

  def job
    BulkExportJob
  end
end