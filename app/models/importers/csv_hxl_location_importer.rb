# frozen_string_literal: true

# Import HXL Location data into Primero from CSV.
# https://hxlstandard.org/standard/1-1final/dictionary/
class Importers::CsvHxlLocationImporter < ValueObject
  attr_accessor :file_name, :column_map, :admin_levels

  def initialize(opts = {})
    opts[:column_map] = {}
    opts[:admin_levels] = []
    super(opts)
  end

  def import
    return Rails.logger.error('Import Not Processed: No file_name passed in') if file_name.blank?

    csv_data = File.read(file_name)
    return Rails.logger.error("Import Not Processed: error reading #{file_name}") if csv_data.blank?

    process_import_file(csv_data)
  end

  private

  def process_import_file(csv_data)
    CSVSafe.parse(csv_data, headers: true).each do |row|
      if column_map.blank?
        map_columns(row)
        self.admin_levels = column_map.keys.map { |key| key.split('+').first }.uniq if column_map.present?
        next
      end

      process_row(row)
    end
  end

  # Set up column mappings based on HXL tags
  def map_columns(row)
    row.each_with_index do |(_key, value), index|
      column_map[value[1..-1]] = index if value.present? && value.first == '#'
    end
  end

  def process_row(row)
    # TODO
  end
end
