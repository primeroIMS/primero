# frozen_string_literal: true

# Returns a translated, rendered value given a Field object.
# This logic is normally handled on the front end, but use this service
# when generating server-side exports or sending emails.
class FieldValueService < ValueObject
  attr_accessor :lookups, :location_service

  def self.value(field, value, opts = {})
    new(opts).value(field, value, opts)
  end

  # TODO: Dates, DateTimes, DateRange, possibly arrays?
  def value(field, value, opts = {})
    case field.type
    when Field::TICK_BOX
      boolean_value(value, opts)
    when Field::RADIO_BUTTON, Field::SELECT_BOX
      selected_value(field, value, opts)
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
    else
      value
    end
  end

  def lookup_value(lookup_unique_id, value, opts = {})
    lookup = self.lookup(lookup_unique_id, opts)
    return value unless lookup

    value_for(lookup.lookup_values, value, opts)
  end

  def record_name_value(class_name, value, opts = {})
    record_class = if class_name.in?(%w[Location ReportingLocation])
                     location_service
                   else
                     Object.const_get(class_name)
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
end
