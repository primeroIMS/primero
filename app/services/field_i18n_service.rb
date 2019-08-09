class FieldI18nService

  def self.convert_i18n_properties(klass, params)
    localized_props = klass.localized_properties.map(&:to_s)
    unlocalized_params = params.reject { |k,_| localized_props.include?(k) }
    localized_fields = localized_props.select { |prop| params[prop].present? }.map do |prop| 
      { "#{prop}_i18n" => params[prop] }
    end.inject(&:merge)

    unlocalized_params.merge(localized_fields || {})
  end

  def self.merge_i18n_properties(fields1, fields2)
    localized_props_1 = fields1.select{ |k,v| k.slice(-4, 4) == 'i18n' }
    localized_props_2 = fields2.select{ |k,v| k.slice(-4, 4) == 'i18n' }
    merged_props = {}
    localized_props_1.each do |name, value|
      value2 = localized_props_2.try(:[], name) || {}
      merged_props[name] = value.try(:merge, value2) || value2
    end
    merged_props
  end

  def self.all_values_for(key)
    I18n.available_locales.map do |locale|
      { locale => I18n.t(key, locale: locale) }
    end.inject(&:merge)
  end

end
