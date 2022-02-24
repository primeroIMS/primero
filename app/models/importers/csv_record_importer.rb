# frozen_string_literal: true

# Import Record data into Primero from CSV.
class Importers::CsvRecordImporter < ValueObject
  attr_accessor :records, :created_by, :owned_by, :errors, :failures, :total, :success_total, :failure_total

  def initialize(opts = {})
    opts.merge!(records: {}, errors: [], failures: [], total: 0, success_total: 0, failure_total: 0)
    super(opts)
  end

  def import(data_io)
    return log_errors(I18n.t('imports.csv_hxl_location.messages.no_data')) if data_io.blank?

    process_import(data_io)
    return if records.blank?

    create_records
    # GenerateLocationFilesJob.perform_now
  end

  private

  def process_import(data_io)
    rows = CSVSafe.parse(data_io, headers: true)
    return log_errors(I18n.t('imports.csv_hxl_location.messages.csv_parse_error')) if rows.blank?

    process_rows(rows)
  end

  def process_rows(rows)
    rows.each_with_index do |row, index|
      call_process_row(row, index)
    end
  end

  def call_process_row(row, index)
    process_row(row)
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_hxl_location.messages.error', row_number: index, message: e.message), row: index)
  end

  # Set up column mappings based on HXL tags
  # def map_columns(row)
  #   row.each_with_index do |(_key, value), index|
  #     next if value.blank? || !value.starts_with?('#')
  #
  #     if value.include?('name') && !locale_valid?(value)
  #       log_errors(I18n.t('imports.csv_hxl_location.messages.locale_invalid', column_name: value))
  #       next
  #     end
  #
  #     column_map[value[1..-1]] = index
  #   end
  # end

  def process_row(row)
    binding.pry
    x=0
    self.total += 1
    # TODO
    self.success_total += 1
  end

  def create_records
    # TODO
    # InsertAllService.insert_all(Location, locations.values, 'location_code')
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_hxl_location.messages.insert_all_error', message: "#{e.message[0..200]}..."))
  end

  def log_errors(message, opts = {})
    errors << message
    failures << opts[:row] if opts[:row].present?
  end
end
