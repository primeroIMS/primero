# frozen_string_literal: true

# Import HXL Location data into Primero from CSV.
# https://hxlstandard.org/standard/1-1final/dictionary/
# rubocop:disable Metrics/ClassLength
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

    process_rows(rows)
  end

  def process_rows(rows)
    rows.each_with_index do |row, index|
      if column_map.blank?
        map_columns(row)
        next if column_map.blank?

        self.max_admin_level = build_max_admin_level
        next
      end
      call_process_row(row, index)
    end
  end

  def call_process_row(row, index)
    process_row(row)
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_hxl_location.messages.error', row_number: index, message: e.message), row: index)
  end

  def build_max_admin_level
    return {} if column_map.blank?

    column_map.keys.map { |key| key.split('+').first }.uniq.map { |a| a.last.to_i }&.max
  end

  # Set up column mappings based on HXL tags
  def map_columns(row)
    row.each_with_index do |(_key, value), index|
      next if value.blank? || !value.starts_with?('#')

      if value.include?('name') && !locale_valid?(value)
        log_errors(I18n.t('imports.csv_hxl_location.messages.locale_invalid', column_name: value))
        next
      end

      column_map[value[1..-1]] = index
    end
  end

  def process_row(row)
    hierarchy = []
    names = {}
    self.total += 1
    (0..max_admin_level).each { |i| process_row_admin_level(row, i, hierarchy, names) }
    self.success_total += 1
  end

  # Each row in the csv contains location info for multiple locations
  # Example: it contains the Admin Level 3 location and each of it's parent locations
  # So... loop through each admin_level and pull out location info for that admin_level
  def process_row_admin_level(row, admin_level = 0, hierarchy = [], names = {})
    location_hash = build_location_hash(row, admin_level, hierarchy, names)
    locations[location_hash[:location_code]] ||= location_hash
  end

  def build_location_hash(row, admin_level, hierarchy, names)
    location_hash = map_admin_level_data(admin_level, row, names)
    location_hash[:type] = type_map[admin_level.to_s]&.first if location_hash[:type].blank?
    hierarchy << location_hash[:location_code]
    location_hash[:hierarchy_path] = hierarchy.join('.')
    location_hash[:name_i18n] = build_names_i18n(names, admin_level)
    location_hash
  end

  def map_admin_level_data(admin_level, row, names)
    location_hash = { admin_level: admin_level, placename_i18n: {}, location_code: '',
                      type: '' }.with_indifferent_access
    add_location_attributes(location_hash, admin_level, row, names)
    location_hash
  end

  def column_name?(key_array)
    key_array.first == 'name'
  end

  def build_names_i18n(names, admin_level)
    names.reduce({}) do |acc, (key, value)|
      acc.merge(key => value[0..admin_level].join(':'))
    end
  end

  def add_location_attributes(location_hash, admin_level, row, names)
    admin_level_tag = admin_level.zero? ? 'country' : "adm#{admin_level}"
    column_map.each do |key, value|
      key_array = key.split('+')
      attributes = key_array[1..-1]
      next unless key_array.first == admin_level_tag

      attribute_value = row[value]
      raise "#{key} blank" if attribute_value.blank?

      build_names(location_hash, names, attributes, attribute_value)
    end
  end

  def build_names(location_hash, names, attributes, attribute_value)
    case attributes.first
    when 'type'
      location_hash[:type] = attribute_value
    when 'code'
      location_hash[:location_code] = attribute_value
    else
      locale = attributes.size == 1 ? 'en' : locale_from_key(attributes)
      location_hash[:placename_i18n][locale] = attribute_value
      names[locale] ||= []
      names[locale] << attribute_value
    end
  end

  def default_type_map
    default_type_map = default_map_from_system_settings
    default_type_map['0'] ||= ['country']
    default_type_map['1'] ||= ['province']
    default_type_map['2'] ||= ['district']
    default_type_map['3'] ||= ['sub_district']
    default_type_map['4'] ||= ['township']
    default_type_map
  end

  def default_map_from_system_settings
    system_settings = SystemSettings.current
    system_settings&.reporting_location_config&.admin_level_map || {}
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
    InsertAllService.insert_all(Location, locations.values, 'location_code')
  rescue StandardError => e
    log_errors(I18n.t('imports.csv_hxl_location.messages.insert_all_error', message: "#{e.message[0..200]}..."))
  end

  def log_errors(message, opts = {})
    errors << message
    failures << opts[:row] if opts[:row].present?
  end
end
# rubocop:enable Metrics/ClassLength
