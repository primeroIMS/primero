module LocalizableProperty
  extend ActiveSupport::Concern

  module ClassMethods

    def localize_properties(properties, options={})
      Primero::Application::locales.each do |locale|
        properties.each { |key| property "#{key}_#{locale}" }
      end

      properties.each do |method|
        define_method method do |*args|
          locale = args.first || I18n.locale
          locale_field_value = self.send("#{method}_#{locale}")
          if locale_field_value.nil? || locale_field_value.empty?
            self.send "#{method}_#{I18n.default_locale}"
          else
            locale_field_value
          end
        end

        define_method "#{method}=" do |value|
          self.send "#{method}_#{I18n.default_locale}=", value
        end

        define_method "#{method}_all=" do |value|
          if options[:generate_keys].present?
            if value.present?
              if value.is_a?(String)
                value =
                    value.gsub(/\r\n?/, "\n").split("\n")
                    .map{|v| v.present? ? ActiveSupport::HashWithIndifferentAccess.new(id: v.parameterize.underscore, display_text: v) : nil}
                    .compact
              elsif value.is_a?(Array) && value.first.is_a?(String)
                value = value.map{|v| v.present? ? ActiveSupport::HashWithIndifferentAccess.new(id: v.parameterize.underscore, display_text: v) : nil}.compact
              end
            end
          end
          Primero::Application::locales.each do |locale|
            self.send "#{method}_#{locale}=", value
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


  def formatted_hash
    properties_hash = {}
    self.properties.map(&:name).each do |property|
      locale = property[-2..-1]
      property_name = property[0..property.length-4]
      property_value = self.get_property_value(property)
      property_value.collect! { |value| value.formatted_hash } if property_value.is_a?(CouchRest::Model::CastedArray)
      property_value.map! { |value| value.is_a?(String) ? value.gsub(/\r\n?/, "\n").rstrip : value } if property_value.is_a?(Array)
      property_value = property_value.gsub(/\r\n?/, "\n").rstrip if property_value.is_a?(String)

      next if property_value.nil?
      if Primero::Application::locales.include? locale.to_s
        properties_hash[property_name] = properties_hash[property_name].nil? ? {locale => property_value} : properties_hash[property_name].merge!({locale => property_value})
      else
        properties_hash[property] = property_value
      end
    end
    properties_hash
  end

  def get_property_value(property)
    value = self.send(property)
    property.include?("option_strings_text") ? value.split("\n") : value if value
  end

end
