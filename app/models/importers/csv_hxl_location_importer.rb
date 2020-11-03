# frozen_string_literal: true

# Import HXL Location data into Primero from CSV.
# https://hxlstandard.org/standard/1-1final/dictionary/
class Importers::CsvHxlLocationImporter < ValueObject
  attr_accessor :file_name, :column_map, :max_admin_level, :type_map, :locations, :errors

  def initialize(opts = {})
    opts[:column_map] = {}
    opts[:type_map] = default_type_map
    opts[:locations] = {}
    opts[:errors] = []
    super(opts)
  end

  def import
    return log_errors('Import Not Processed: No file_name passed in') if file_name.blank?

    return log_errors("Import Not Processed: #{file_name} does not exist") unless File.exist?(file_name)

    process_import_file(file_name)
    create_locations
  end

  private

  def process_import_file(file_name)
    CSVSafe.foreach(file_name, headers: true).with_index do |row, i|
      if column_map.blank?
        map_columns(row)
        self.max_admin_level = column_map.keys.map { |key| key.split('+').first }.uniq.map { |a| a.last.to_i }&.max if column_map.present?
        next
      end

      begin
        process_row(row)
      rescue => e
        log_errors("Row #{i} Not Processed: #{e.message}")
      end
    end
  end

  # Set up column mappings based on HXL tags
  def map_columns(row)
    row.each_with_index do |(_key, value), index|
      next if value.blank?

      next unless value.starts_with?('#')

      if value.include?('name') && !locale_valid?(value)
        log_errors("Skipping #{value}: Locale invalid")
        next
      end

      column_map[value[1..-1]] = index if value.present? && value.starts_with?('#')
    end
  end

  def process_row(row)
    hierarchy = []
    for i in 0..max_admin_level do
      process_row_admin_level(row, i, hierarchy)
    end
  end

  def process_row_admin_level(row, admin_level = 0, hierarchy = [])
    admin_level_tag = admin_level == 0 ? 'country' : "adm#{admin_level}"
    location_hash = { admin_level: admin_level }
    column_map.each do |key, value|
      key_array = key.split('+')
      next unless key_array.first == admin_level_tag

      raise "#{key} blank" if row[value].blank?

      location_hash[location_attribute(key_array[1..-1]).to_sym] = row[value]
    end

    location_hash[:type] ||= type_map[admin_level.to_s]&.first
    hierarchy << location_hash[:location_code]
    location_hash[:hierarchy_path] = hierarchy.join('.')

    locations[location_hash[:location_code]] ||= location_hash
  end

  def location_attribute(key_array)
    return name_attribute(key_array) if key_array.first == 'name'

    return 'location_code' if key_array.first == 'code'

    key_array.first
  end

  def name_attribute(key_array)
    return 'placename_en' if key_array.size == 1

    "placename_#{locale_from_key(key_array)}"
  end

  def default_type_map
    system_settings = SystemSettings.current
    default_type_map = system_settings&.reporting_location_config&.admin_level_map || {}
    default_type_map['0'] ||= ['country']
    default_type_map['1'] ||= ['province']
    default_type_map['2'] ||= ['district']

    # TODO: verify the values of 3 & 4
    default_type_map['3'] ||= ['sub_district']
    default_type_map['4'] ||= ['camp']
    default_type_map
  end

  def locale_from_key(key_array)
    locale = key_array.last
    if locale.include?('-')
      locale_parts = locale.split('-')
      locale = "#{locale_parts.first.downcase}-#{locale_parts.last.upcase}"
    else
      locale.downcase!
    end
    locale
  end

  def locale_valid?(value)
    key_array = value.split('+')
    return true if key_array.last == 'name'

    I18n.available_locales.include?(locale_from_key(key_array).to_sym)
  end

  # TODO: Look at streamlining this or putting in a background job
  # TODO: Processing a file with 414 locations takes about 8 seconds
  def create_locations
    return log_errors('Import not processed: No locations to create') if locations.blank?

    location_array = []
    locations.each { |_key, value| location_array << Location.new(value) }
    Location.locations_by_code = location_array.map{|l|[l.location_code,l]}.to_h
    location_array.each do |loc|
      loc.set_name_from_hierarchy_placenames
    end
    location_array.each(&:save!)
  end

  def log_errors(message)
    errors << message
    Rails.logger.error(message)
  end
end
