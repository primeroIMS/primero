# frozen_string_literal: true

# Import HXL Location data into Primero from CSV.
# https://hxlstandard.org/standard/1-1final/dictionary/
class Importers::CsvHxlLocationImporter < ValueObject
  attr_accessor :column_map, :max_admin_level, :type_map, :locations, :errors,
                :failures, :total, :success_total, :failure_total

  def initialize
    super(column_map: {}, type_map: default_type_map, locations: {}, errors: [], failures: [],
          total: 0, success_total: 0, failure_total: 0)
  end

  def import(data_io)
    return log_errors(I18n.t('imports.csv_hxl_location.messages.no_data')) if data_io.blank?

    process_import(data_io)
    return if locations.blank?

    create_locations
    GenerateLocationFilesJob.perform_now
  end

  private

  def process_import(data_io)
    rows = CSVSafe.parse(data_io, headers: true)
    return log_errors(I18n.t('imports.csv_hxl_location.messages.csv_parse_error')) if rows.blank?

    rows.each_with_index do |row, i|
      if column_map.blank?
        map_columns(row)
        next if column_map.blank?

        self.max_admin_level = column_map.keys.map { |key| key.split('+').first }.uniq.map { |a| a.last.to_i }&.max
        next
      end

      begin
        process_row(row)
      rescue StandardError => e
        log_errors(I18n.t('imports.csv_hxl_location.messages.error', row_number: i, message: e.message), row: i)
      end
    end
  end

  # Set up column mappings based on HXL tags
  def map_columns(row)
    row.each_with_index do |(_key, value), index|
      next if value.blank?

      next unless value.starts_with?('#')

      if value.include?('name') && !locale_valid?(value)
        log_errors(I18n.t('imports.csv_hxl_location.messages.locale_invalid', column_name: value))
        next
      end

      column_map[value[1..-1]] = index if value.present? && value.starts_with?('#')
    end
  end

  def process_row(row)
    hierarchy = []
    self.total += 1
    (0..max_admin_level).each { |i| process_row_admin_level(row, i, hierarchy) }
    self.success_total += 1
  end

  # Each row in the csv contains location info for multiple locations
  # Example: it contains the Admin Level 3 location and each of it's parent locations
  # So... loop through each admin_level and pull out location info for that admin_level
  def process_row_admin_level(row, admin_level = 0, hierarchy = [])
    location_hash = map_admin_level_data(admin_level, row)
    location_hash[:type] ||= type_map[admin_level.to_s]&.first
    hierarchy << location_hash[:location_code]
    location_hash[:hierarchy_path] = hierarchy.join('.')

    locations[location_hash[:location_code]] ||= location_hash
  end

  def map_admin_level_data(admin_level, row)
    admin_level_tag = admin_level.zero? ? 'country' : "adm#{admin_level}"
    location_hash = { admin_level: admin_level }
    column_map.each do |key, value|
      key_array = key.split('+')
      next unless key_array.first == admin_level_tag

      raise "#{key} blank" if row[value].blank?

      location_hash[location_attribute(key_array[1..-1]).to_sym] = row[value]
    end
    location_hash
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
    default_type_map['3'] ||= ['sub_district']
    default_type_map['4'] ||= ['township']
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

  def create_locations
    # TODO: This is not good: Location.locations_by_code is global and not thread safe.
    Location.locations_by_code = locations.map { |key, value| [key, Location.new(value)] }.to_h
    location_hashes = location_hashes(Location.locations_by_code.values)
    begin
      InsertAllService.insert_all(Location, location_hashes, 'location_code')
    rescue StandardError => e
      log_errors(I18n.t('imports.csv_hxl_location.messages.insert_all_error', message: "#{e.message[0..200]}..."))
    end
    Location.locations_by_code = nil
  end

  def location_hashes(locations)
    locations.map do |location|
      location.set_name_from_hierarchy_placenames
      location.attributes.except('id')
    end
  end

  def log_errors(message, opts = {})
    errors << message
    failures << opts[:row] if opts[:row].present?
  end
end
