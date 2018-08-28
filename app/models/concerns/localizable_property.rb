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
          locale_field_value(method, locale)
        end

        define_method "#{method}=" do |value|
          value = generate_keyed_value(value) if options[:generate_keys].present?
          self.send "#{method}_#{I18n.default_locale}=", value
        end

        define_method "#{method}_all=" do |value|
          value = generate_keyed_value(value) if options[:generate_keys].present?
          Primero::Application::locales.each{|locale| self.send "#{method}_#{locale}=", value }
        end
      end
      @localized_properties ||= []
      @localized_properties += properties
    end

    def localized_properties
      @localized_properties
    end

  end


  #TODO this breaks in 2 scenarios...
  # 1) fields such as unique_id get confused with the Indonesia locale 'id'
  # 2) some locales such as ar-LB are more than 2 chars long.  Bad to assume last 2 characters are the locale
  # Another thing that is bad with this is it loops through all properties, even non-localized properties
  # It is suspected this is only used by the 'published' api action which is not used by the mobile app
  # TODO LB-293 removing this method will be addressed in a later ticket.
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

  def localized_hash(locale='en')
    #Do not include option_strings_text... there is special handling of that in the Field model
    lp = self.class.localized_properties.reject{|p| p == :option_strings_text}.map{|p| "#{p.to_s}_#{locale}"}
    lh = self.as_json(only: lp)

    #remove the locale tag from the keys
    lh.keys.each{|k| new_key = k.split('_')[0..-2].join('_'); lh[new_key] = lh.delete k}
    lh
  end

  private

  def generate_keyed_value(value)
    if value.present?
      if value.is_a?(String)
        value =
            value.gsub(/\r\n?/, "\n").split("\n")
                .map{|v| v.present? ? {id: v.parameterize.underscore, display_text: v}.with_indifferent_access : nil}
                .compact
      elsif value.is_a?(Array)
        if value.first.is_a?(String)
          value = value.map{|v| v.present? ? {id: v.parameterize.underscore, display_text: v}.with_indifferent_access : nil}.compact
        elsif value.first.is_a?(Hash)
          value
        end
      end
    end
  end

  def locale_field_value(method, locale)
    #If value for the default locale is nil, return the English translation
    locale_field_value = self.send("#{method}_#{locale}")
    if locale_field_value.present?
      return locale_field_value if locale_field_value.is_a?(String)
      if locale_field_value.is_a?(Array) && locale_field_value.first.is_a?(Hash)
        locale_field_value.any?{|op| op['display_text'].present?} ? locale_field_value : self.send("#{method}_#{FormSection::DEFAULT_BASE_LANGUAGE}")
      else
        locale_field_value
      end
    else
      self.send("#{method}_#{FormSection::DEFAULT_BASE_LANGUAGE}")
    end
  end


end
