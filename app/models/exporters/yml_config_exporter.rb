# frozen_string_literal: true

# Export all forms and lookups as YAML for translation
class Exporters::YmlConfigExporter < ValueObject
  attr_accessor :export_directory, :form_params, :locale, :visible

  def initialize(opts = {})
    opts[:export_directory] ||= "configuration_translation_export_#{DateTime.now.strftime('%Y%m%d.%I%M%S')}"
    opts[:locale] ||= Primero::Application::LOCALE_ENGLISH
    opts[:form_params] = opts.slice(:record_type, :module_id, :visible, :unique_id)&.compact
    super(opts)
    FileUtils.mkdir_p(export_directory)
  end

  def export
    FormSection.list(form_params).each do |form|
      export_to_file(localized_form_hash(form.configuration_hash, locale))
    end
    export_to_file(localized_lookups_hash(Lookup.all.map(&:configuration_hash), locale)) unless form_params[:unique_id]
  end

  def export_to_file(hash)
    file_name = file_for(hash)
    File.open(file_name, 'a') do |f|
      f << hash.to_yaml
    end
  end

  def file_for(hash)
    unique_id = hash.values.first.keys.first
    file_name = unique_id.start_with?('lookup-') ? 'lookup' : unique_id
    "#{export_directory}/#{file_name}.yml"
  end

  def localized_form_hash(form_hash, locale)
    fields_hash = form_hash['fields_attributes']
                  .select { |field_hash| visible.nil? || (visible && field_hash['visible']) }
                  .map { |field_hash| localized_field_hash(field_hash, locale) }
                  .inject(&:merge)
    {
      locale => {
        form_hash['unique_id'] => localized_hash(form_hash, locale).merge('fields' => fields_hash)
      }
    }
  end

  def localized_field_hash(field_hash, locale)
    hash = localized_hash(field_hash, locale)
    if field_hash['option_strings_text_i18n'].present?
      hash = hash.merge(
        'option_strings_text' => localized_options_hash(field_hash['option_strings_text_i18n'], locale)
      )
    end

    { field_hash['name'] => hash }
  end

  def localized_lookups_hash(lookup_hashes, locale)
    {
      locale => lookup_hashes.map { |lookup_hash| localized_lookup_hash(lookup_hash, locale) }
                             .inject(&:merge)
    }
  end

  def localized_lookup_hash(lookup_hash, locale)
    {
      lookup_hash['unique_id'] => localized_hash(lookup_hash, locale).merge(
        'lookup_values' => localized_options_hash(lookup_hash['lookup_values_i18n'], locale)
      )
    }
  end

  def localized_options_hash(options_hash, locale)
    options_hash.map { |option_hash| { option_hash['id'] => option_hash['display_text'][locale] } }
                .inject(&:merge)
  end

  def localized_hash(hash, locale)
    hash.select { |key, value| key.ends_with?('_i18n') && value.present? && value.is_a?(Hash) }
        .map { |key, value| [key.sub(/_i18n\z/, ''), value[locale]] }.to_h
  end
end
