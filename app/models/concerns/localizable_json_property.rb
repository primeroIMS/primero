module LocalizableJsonProperty
  extend ActiveSupport::Concern

  module ClassMethods
    def localize_properties(*properties)
      properties = properties.flatten
      properties.each do |property|
        store = "#{property}_i18n"

        I18n.available_locales.each do |locale|
          accessor = "#{property}_#{locale}"

          define_method("#{accessor}=") do |value|
            write_store_attribute(store, locale, value)
          end

          define_method(accessor) do
            locale_store = read_store_attribute(store, locale)
            locale_field_value(store, locale_store)
          end
        end
        define_method property do |locale=nil|
          locale = I18n.locale unless locale.present?
          locale_store = read_store_attribute(store, locale)
          return read_store_attribute(store, I18n.default_locale) if locale_store.nil?
          locale_field_value(store, locale_store)
        end

        define_method "#{property}=" do |value, locale=nil|
          locale = I18n.locale unless locale.present?
          write_store_attribute(store, locale, value)
        end

        define_method "#{property}_all=" do |value|
          I18n.available_locales.each do |locale|
            write_store_attribute(store, locale, value)
          end
        end
      end

      @localized_properties ||= []
      @localized_properties += properties
    end

    def localized_properties
      @localized_properties
    end

  end

  def localized_hash(locale = Primero::Application::BASE_LANGUAGE)
    #Do not include option_strings_text... there is special handling of that in the Field model
    localized_properties = self.class.localized_properties.reject{|p| p == :option_strings_text}.map{|p| "#{p.to_s}_i18n"}
    localized_hash = self.as_json(only: localized_properties)

    localized_hash.reduce({}) do |acc, (key, value)|
      new_key = key.split('_')[0..-2].join('_');
      acc[new_key] = value.try(:[], locale)
      acc
    end
  end

  def locale_field_value(store, locale_store)
    if locale_store.is_a?(Array) && locale_store.first.is_a?(Hash)
      locale_store.any?{|op| op["display_text"].present?} ? locale_store : read_store_attribute(store, Primero::Application::BASE_LANGUAGE)
    else
      locale_store
    end
  end
end
