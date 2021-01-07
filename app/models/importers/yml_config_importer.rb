# frozen_string_literal: true

# Import form and lookup YAML translations
class Importers::YmlConfigImporter < ValueObject
  attr_accessor :file_name, :class_to_import, :locale

  def initialize(opts = {})
    opts[:class_to_import] = opts[:file_name].downcase.include?('lookup') ? 'Lookup' : 'FormSection'
    super(opts)
  end

  def import
    return Rails.logger.error('Import Not Processed: No file_name passed in') if file_name.blank?

    return Rails.logger.error('Import Not Processed: No class_to_import passed in') if class_to_import.blank?

    config_data = YAML.load_file(file_name)
    return Rails.logger.error("Import Not Processed: error reading #{file_name}") if config_data.blank?

    process_import_file(config_data)
  end

  private

  def process_import_file(config_data)
    return Rails.logger.error('Import Not Processed: invalid yml format') unless config_data.is_a?(Hash)

    locale = config_data&.keys&.first&.to_sym
    return Rails.logger.error('Import Not Processed: locale not passed in') if locale.blank?

    return Rails.logger.error("Import Not Processed: locale #{locale} not in available locales") if I18n.available_locales.exclude?(locale)

    config_data.values.each do |config|
      config = strip_hash_values!(config)
      send("import_#{class_to_import.underscore}", locale, config) if %w[FormSection Lookup].include?(class_to_import)
    end
  end

  def import_form_section(locale, config)
    # We expect that there is only 1 form per translation file
    unique_id = config.keys.first
    return Rails.logger.error('Error importing translations: Form ID not present') if unique_id.blank?

    form = FormSection.find_by(unique_id: unique_id)
    return Rails.logger.error("Error importing translations: Form for ID [#{unique_id}] not found") if form.blank?

    form.update_translations(locale, config.values.first)
    Rails.logger.info("Updating Form translation: Form [#{unique_id}] locale [#{locale}]")
    form.save!
  end

  def import_lookup(locale, config)
    config.each do |key, value|
      lookup = Lookup.find_by(unique_id: key)
      if lookup.blank?
        Rails.logger.info("Lookup for ID [#{key}] not found. Skipping translation")
        next
      end

      lookup.update_translations(locale, value)
      Rails.logger.info "Updating Lookup translation: Lookup [#{key}] locale [#{locale}]"
      lookup.save!
    end
  end

  def strip_hash_values!(hash)
    hash.each_value do |value|
      case value
        when String
          value.strip!
        when Hash
          strip_hash_values!(value)
      end
    end
  end
end
