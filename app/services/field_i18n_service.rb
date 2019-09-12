class FieldI18nService

  #  Converts the received parameters to localized properties
  #  of the class.
  #  Assuming name as a localized property of klass:
  #  Given the params
  #  { 'name' => { 'en' => 'Lastname', 'es' => 'Apellido' } }
  #  Returns
  #  { 'name_i18n' => { 'en' => 'Lastname', 'es' => 'Apellido' } }
  def self.convert_i18n_properties(klass, params)
    localized_props = klass.localized_properties.map(&:to_s)
    unlocalized_params = params.reject { |k,_| localized_props.include?(k) }
    localized_fields = localized_props.select { |prop| params[prop].present? }.map do |prop| 
      { "#{prop}_i18n" => params[prop] }
    end.inject(&:merge)

    unlocalized_params.merge(localized_fields || {})
  end

  #  Takes the i18n properties of the hashes fields1 and fields2
  #  and tries to merge them.
  #  Given the hashes
  #  { name_i18n: { en: "Lastname" } }
  #  { name_i18n: { es: "Apellido"} }
  #  Returns
  #  { name_i18n: { en: "Lastname", es: "Apellido" } }
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

  #  Removes the "_i18n" suffix of the source hash and mantains
  #  the key type.
  #  Given the hash
  #  { name_i18n: "Lastname"}
  #  Returns
  #  { name: "Lastname" }
  def self.strip_i18n_suffix(source)
    source.map do |k,v|
      key = k.to_s.gsub(/_i18n/, '')
      key = key.to_sym if k.is_a?(Symbol)
      { key => v }
    end.inject(&:merge)
  end

  #  Fill the keys with all the available locales. If a locale is not
  #  present in source then is set to empty
  #  Assumming the languages [ :en, :es, :fr ] are available
  #  Given the keys and source
  #  (['name'], { 'name' => { 'en' => "Lastname", 'es' => "Apellido" } })
  #  Returns
  #  { 'name' => { 'en' => "Lastname", 'es' => "Apellido", 'fr' => "" } }
  def self.fill_keys(keys, source)
    keys = keys.map(&:to_s) if source.keys.first.is_a?(String)

    keys.each do |key|
      if source[key].present?
        locales = I18n.available_locales.map do |locale|
          locale = locale.to_s if source[key].keys.first.is_a?(String)
          { locale => "" }
        end.inject(&:merge)

        source[key] = locales.merge(source[key]) 
      end
    end
    source
  end

  #  Fill the options hash with all the available locales. If a locale is
  #  not present in the hash, then is set to an empty array.
  #  Assumming the languages [ :en, :es, :fr ] are available.
  #  Given the options
  #  {
  #    en: [{ id: "true", display_name: "True" }],
  #    es: [{ id: "true", display_name: "Verdadero" }]
  #  }
  #  Returns
  #  {
  #    en: [{ id: "true", display_name: "True" }],
  #    es: [{ id: "true", display_name: "Verdadero" }],
  #    fr: []
  #  }
  def self.fill_options(options)
    locales = I18n.available_locales.map do |locale|
      locale = locale.to_s if options.keys.first.is_a?(String)
      { locale => [] }
    end.inject(&:merge)
    locales.merge(options)
  end

end