# frozen_string_literal: true

# Methods that allow the dynamic generation of i18n getters and setters
module LocalizableJsonProperty
  extend ActiveSupport::Concern

  # Define class methods
  module ClassMethods
    def localize_properties(*properties)
      options = properties.extract_options!
      properties = properties.flatten
      properties.each do |property|
        store = "#{property}_i18n"
        build_accessors_methods(options[:options_list], store, property)
      end

      (@localized_properties ||= []).concat(properties)
    end

    def localized_properties
      @localized_properties
    end

    def build_accessors_methods(options_list, store, property)
      define_available_locales_accessors(options_list, store, property)
      if options_list
        define_current_option_accessors(store, property)
      else
        define_current_accessors(store, property)
        define_all_setter(store, property)
      end
    end

    def define_available_locales_accessors(is_option, store, property)
      I18n.available_locales.each do |locale|
        if is_option
          define_option_locale_accessors(store, property, locale)
        else
          define_locale_accessors(store, property, locale)
        end
      end
    end

    def define_locale_accessors(store, property, locale)
      accessor = "#{property}_#{locale}"

      define_method("#{accessor}=") do |value|
        write_store_attribute(store, locale, value)
      end

      define_method(accessor) do
        locale_store = read_store_attribute(store, locale)
        locale_field_value(store, locale_store)
      end
    end

    def define_current_accessors(store, property)
      define_method property do |locale = nil|
        locale = I18n.locale unless locale.present?
        locale_store = read_store_attribute(store, locale)
        return read_store_attribute(store, I18n.default_locale) if locale_store.nil?

        locale_field_value(store, locale_store)
      end

      define_method "#{property}=" do |value, locale = nil|
        locale = I18n.locale unless locale.present?
        write_store_attribute(store, locale, value)
      end
    end

    def define_all_setter(store, property)
      define_method "#{property}_all=" do |value|
        I18n.available_locales.each do |locale|
          write_store_attribute(store, locale, value)
        end
      end
    end

    def define_option_locale_accessors(store, property, locale)
      accessor = "#{property}_#{locale}"
      define_method(accessor) do
        define_property_getter(store, locale)
      end

      define_method("#{accessor}=") do |values|
        define_property_setter(store, values.map(&:with_indifferent_access), locale)
      end
    end

    def define_current_option_accessors(store, property)
      define_method property do |locale = nil|
        define_property_getter(store, locale)
      end

      define_method "#{property}=" do |values, locale = nil|
        locale ||= I18n.locale
        define_property_setter(store, values.map(&:with_indifferent_access), locale)
      end
    end
  end

  def localized_hash(locale = Primero::Application::LOCALE_ENGLISH)
    # Do not include option_strings_text... there is special handling of that in the Field model
    localized_properties = self.class.localized_properties
                               .reject { |p| p == :option_strings_text }
                               .map { |p| "#{p}_i18n" }
    localized_hash = as_json(only: localized_properties)

    localized_hash.each_with_object({}) do |(key, value), acc|
      new_key = key.split('_')[0..-2].join('_')
      acc[new_key] = value.try(:[], locale)
    end
  end

  def locale_field_value(store, locale_store)
    if locale_store.is_a?(Array) && locale_store.first.is_a?(Hash)
      if locale_store.any? { |op| op['display_text'].present? }
        locale_store
      else
        read_store_attribute(store, Primero::Application::LOCALE_ENGLISH)
      end
    else
      locale_store
    end
  end

  def merge_options(current_options, new_options)
    return current_options if new_options.nil?

    options = (new_options + current_options).map do |opt|
      opt.to_h.with_indifferent_access
    end

    options.uniq { |h| h[:id] }.reject { |c| c[:_delete] }
  end

  def define_property_getter(store, locale)
    current_store = send(store) || []
    locale = locale || I18n.locale || I18n.default_locale
    current_store.map { |option| option.merge('display_text' => option['display_text'][locale.to_s]) }
  end

  def define_property_setter(store, values, locale)
    current_store = send(store) || []
    values.each do |current_value|
      current_option = find_option_in_store(current_store, current_value['id'])
      property_setter(current_store, current_option, current_value, locale)
    end
    write_attribute(store, current_store)
  end

  def find_option_in_store(current_store, id)
    current_store.find do |opt|
      opt.dig('id') == id
    end
  end

  def property_setter(current_store, current_option, current_value, locale)
    if current_option
      current_option['display_text'][locale.to_s] = current_value.dig('display_text')
    else
      current_option = {}.with_indifferent_access
      current_option['id'] = current_value.dig('id')
      current_option['display_text'] = { "#{locale}": current_value.dig('display_text') }.with_indifferent_access

      current_store << current_option
    end
  end
end
