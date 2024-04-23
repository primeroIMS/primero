# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Import Record data into Primero from CSV.
# WARNING!!!  Never expose this via an API.  Doing so would pose a security risk
class Importers::CsvRecordImporter < ValueObject
  attr_accessor :record_class, :file_path, :batch_size, :created_by, :owned_by, :batch_total, :errors, :failures,
                :total, :success_total, :failure_total

  def initialize(opts = {})
    opts[:batch_size] ||= 250
    opts.merge!(errors: [], failures: [], batch_total: 0, total: 0, success_total: 0, failure_total: 0)
    super(opts)
  end

  def import
    return log_errors(I18n.t('imports.csv_record.messages.no_data')) if file_path.blank?

    return log_errors(I18n.t('imports.csv_record.messages.no_file')) unless file_path.file?

    File.open(file_path) { |file| process_file(file) }

    reindex_records
  end

  private

  def process_file(file)
    return log_errors(I18n.t('imports.csv_record.messages.no_data')) if file.blank?

    headers = file.first
    file.lazy.each_slice(batch_size) { |file_batch| process_batch(file_batch.join, headers) }
  end

  def process_batch(file_batch, headers)
    self.batch_total += 1
    rows = CSVSafe.parse(file_batch, headers:)
    return log_errors(I18n.t('imports.csv_record.messages.csv_parse_error')) if rows.blank?

    records = process_rows(rows)
    return if records.blank?

    create_records(records)
  end

  def process_rows(rows)
    records = []
    rows.each_with_index do |row, index|
      records << call_process_row(row.delete_if { |k, v| k.blank? || v.blank? }, index)
    end
    records
  end

  def call_process_row(row, index)
    self.total += 1
    record = process_row(row)
    self.success_total += 1
    record
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_record.messages.error', row_number: index, message: e.message), row: index)
  end

  def process_row(row)
    record_hash = {}
    row_hash = row.to_h.with_indifferent_access
    id = row_hash.delete(:id)
    record_hash[:id] = id if id.present?
    row_hash[:module_id] ||= PrimeroModule::CP
    record_hash[:data] = row_hash.merge(owned_by:, created_by:)
    record = record_class.new(record_hash)
    record.run_callbacks(:create) { false }
    cleanse_record(record, id)
  end

  def cleanse_record(record, id)
    # Do not include attributes that do not exist in the DB table
    record_attributes = record.attributes.slice(*record_class.column_names)

    # Do not include id attribute if this is a create
    record_attributes.delete('id') if id.blank?
    record_attributes
  end

  def create_records(records)
    InsertAllService.insert_all(record_class, records, 'id')
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_record.messages.insert_all_error', message: "#{e.message[0..200]}..."))
  end

  def reindex_records
    location_service = LocationService.new(true)
    record_class.all.find_in_batches(batch_size:) do |records|
      records.each { |r| r.location_service = location_service } unless record_class == Trace
      Sunspot.index(records)
    end
  end

  def log_errors(message, opts = {})
    errors << message
    failures << opts[:row] if opts[:row].present?
  end
end
