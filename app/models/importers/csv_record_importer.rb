# frozen_string_literal: true

# Import Record data into Primero from CSV.
# WARNING!!!  Never expose this via an API.  Doing so would pose a security risk
class Importers::CsvRecordImporter < ValueObject
  attr_accessor :data_io, :record_class, :records, :created_by, :owned_by, :errors, :failures, :total, :success_total,
                :failure_total

  def initialize(opts = {})
    data_io = open_file(opts[:file_name])
    opts.merge!(data_io: data_io, records: [], errors: [], failures: [], total: 0, success_total: 0,
                failure_total: 0)
    super(opts)
  end

  def import
    return log_errors(I18n.t('imports.csv_record.messages.no_data')) if data_io.blank?

    process_import
    return if records.blank?

    create_records
  end

  private

  def open_file(file_name)
    return if file_name.blank?

    data = File.open(file_name, 'rb').read.force_encoding('UTF-8')
    StringIO.new(data)
  end

  def process_import
    rows = CSVSafe.parse(data_io, headers: true)
    return log_errors(I18n.t('imports.csv_record.messages.csv_parse_error')) if rows.blank?

    process_rows(rows)
  end

  def process_rows(rows)
    rows.each_with_index do |row, index|
      call_process_row(row.delete_if { |k, v| k.blank? || v.blank? }, index)
    end
  end

  def call_process_row(row, index)
    self.total += 1
    records << process_row(row)
    self.success_total += 1
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_record.messages.error', row_number: index, message: e.message), row: index)
  end

  def process_row(row)
    registry_hash = {}
    row_hash = row.to_h.with_indifferent_access
    id = row_hash.delete(:id)
    registry_hash[:id] =  id if id.present?
    registry_hash[:data] = row_hash.merge(owned_by: owned_by, created_by: created_by)
    registry_hash
  end

  def create_records
    InsertAllService.insert_all(record_class, records)
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_record.messages.insert_all_error', message: "#{e.message[0..200]}..."))
  end

  def log_errors(message, opts = {})
    errors << message
    failures << opts[:row] if opts[:row].present?
  end
end
