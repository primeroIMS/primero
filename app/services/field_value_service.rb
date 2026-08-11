# frozen_string_literal: true

# Returns a translated, rendered value given a Field object.
# This logic is normally handled on the front end, but use this service
# when generating server-side exports or sending emails.
class FieldValueService < ValueObject
  attr_accessor :lookups, :agencies, :location_service, :registry_records, :registry_fields_by_type, :system_settings

  def self.value(field, value, opts = {})
    new(opts).value(field, value, opts)
  end

  # TODO: DateRange? Censored values?
  def value(field, value, opts = {})
    case value
    when Time then I18n.l(value, format: :with_time)
    when Date then I18n.l(value)
    when Array then value.map { |item| self.value(field, item, opts) }
    else
      return value unless field.present?

      value_for_field(field, value, opts)
    end
  end

  def value_for_field(field, value, opts)
    case field.type
    when Field::TICK_BOX
      boolean_value(value, opts)
    when Field::RADIO_BUTTON, Field::SELECT_BOX
      selected_value(field, value, opts)
    when Field::REGISTRY
      registry_value(field, value, opts)
    else
      value
    end
  end

  def boolean_value(value, opts = {})
    return if value.nil?

    I18n.t(value.to_s, locale: locale(opts))
  end

  def selected_value(field, value, opts = {})
    return if value.nil?
    return value_for(field.option_strings_text_i18n, value, opts) if field.option_strings_text.present?
    return value unless field.option_strings_source

    source_options = field.option_strings_source.split
    case source_options.first
    when 'lookup' then lookup_value(source_options.last, value, opts)
    when 'Location', 'ReportingLocation', 'Agency'
      record_name_value(source_options.first, value, opts)
    else value end
  end

  def lookup_value(lookup_unique_id, value, opts = {})
    lookup = self.lookup(lookup_unique_id, opts)
    return value unless lookup

    value_for(lookup.lookup_values_i18n, value, opts)
  end

  def registry_value(field, value, opts = {})
    registry_fields = registry_fields_for(field)
    registry_record = registry_records&.dig(value) || RegistryRecord.find_by(id: value)
    return unless registry_record.present? && registry_fields.present?

    registry_fields.map do |registry_field|
      self.value(registry_field, registry_record.data[registry_field.name], opts)
    end.compact.join(' - ')
  end

  def record_name_value(class_name, value, opts = {})
    return agencies[value] if class_name == 'Agency' && agencies&.key?(value)

    record_class = if class_name.in?(%w[Location ReportingLocation])
                     location_service
                   else
                     Agency
                   end

    return value unless record_class

    record = record_class.find_by(record_class.unique_id_attribute => value)
    record&.name(locale(opts))
  end

  def value_for(options_list, value, opts = {})
    option = options_list.find { |o| o['id'] == value.to_s }
    return unless option
    return option['display_text'] if option['display_text'].is_a?(String)

    option['display_text'][locale(opts)] || option['display_text']['en']
  end

  def locale(opts = {})
    locale = opts[:locale] || I18n.locale
    locale.to_s
  end

  def lookup(unique_id, opts = {})
    self.lookups ||= opts[:lookups]
    self.lookups ||= Lookup.all # TODO: enabled only?

    lookups.find { |lookup| lookup.unique_id == unique_id }
  end

  def registry_fields_for(field)
    field_names = registry_field_names(field)
    self.registry_fields_by_type ||= {}
    return [] unless field_names.present?

    self.registry_fields_by_type[field.option_strings_source] ||= Field.joins(:form_section).where(
      name: field_names, form_section: { parent_form: RegistryRecord.parent_form }
    ).index_by(&:name).values_at(*field_names).compact

    registry_fields_by_type[field.option_strings_source]
  end

  def registry_field_names(field)
    system_settings.registry_options&.dig(field.option_strings_source, 'collapsed_field_names')
  end
end
