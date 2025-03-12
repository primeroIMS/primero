# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Import form and lookup YAML translations
class Importers::YmlConfigImporter < ValueObject
  attr_accessor :file_name, :class_to_import, :locale, :errors, :failures

  IMPORTABLE_CLASSES = %w[FormSection Lookup Theme].freeze

  def initialize(opts = {})
    opts[:class_to_import] = selected_import_class(opts[:file_name]) if opts[:file_name].present?
    opts.merge!(errors: [], failures: [])
    super(opts)
  end

  # TODO: Refactor when other classes are needed for import
  def selected_import_class(filename = '')
    filename_str = filename.downcase

    if filename_str.include?('system')
      %w[Theme]
    elsif filename_str.include?('lookup')
      'Lookup'
    else
      'FormSection'
    end
  end

  def import
    return log_errors('Import Not Processed: No file_name passed in') if file_name.blank?

    return log_errors('Import Not Processed: No class_to_import passed in') if class_to_import.blank?

    config_data = YAML.load_file(file_name)
    return log_errors("Import Not Processed: error reading #{file_name}") if config_data.blank?

    process_import_file(config_data)
  end

  private

  def process_import_file(config_data)
    return Rails.logger.error('Import Not Processed: invalid yml format') unless config_data.is_a?(Hash)

    self.locale = valid_locale(config_data)
    return nil if locale.blank?

    process_config_data(config_data)
  end

  def valid_locale(config_data)
    locale = config_data&.keys&.first&.to_sym
    if locale.blank?
      log_errors('Import Not Processed: locale not passed in')
      return nil
    end

    if I18n.available_locales.exclude?(locale)
      log_errors("Import Not Processed: locale #{locale} not in available locales")
      return nil
    end

    locale
  end

  def import_class(model_class, config)
    return unless IMPORTABLE_CLASSES.include?(model_class)

    send("import_#{model_class.underscore}", locale, config)
  end

  def process_config_data(config_data)
    config_data.each_value do |config|
      config = strip_hash_values!(config)

      if class_to_import.is_a?(Array)
        class_to_import.each do |model_class|
          import_class(model_class, config)
        end
      else
        import_class(class_to_import, config)
      end
    end
  end

  def import_form_section(locale, config)
    # We expect that there is only 1 form per translation file
    unique_id = config.keys.first
    return log_errors('Error importing translations: Form ID not present') if unique_id.blank?

    form = FormSection.find_by(unique_id:)
    return log_errors("Error importing translations: Form for ID [#{unique_id}] not found") if form.blank?

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

  # rubocop:disable Metrics/AbcSize
  def import_theme(locale, config)
    theme = Theme.current

    config['theme'].each do |key, value|
      theme.data[key] = {} unless theme.data[key].present?
      theme.data[key][locale.to_s] = value
    end

    Rails.logger.info 'Updating theme'
    theme.bypass_logos = true
    theme.save!
  end
  # rubocop:enable Metrics/AbcSize

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

  def log_errors(message, opts = {})
    errors << message
    failures << opts[:row] if opts[:row].present?
  end
end
