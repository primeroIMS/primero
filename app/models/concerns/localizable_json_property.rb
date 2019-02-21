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
            read_store_attribute(store, locale)
          end
        end
        define_method property do |locale=nil|
          locale = I18n.locale unless locale.present?
          locale_store = read_store_attribute(store, locale)
          return read_store_attribute(store, I18n.default_locale) if locale_store.nil?
          locale_store
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
end

