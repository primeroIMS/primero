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

  #  Takes the i18n options of the hashes options1 and options2
  #  and tries to merge them.
  #  Given the hashes
  #  { en: [{ 'id' => 'true', 'display_name' => 'Valid' }] }
  #  { en: [{ 'id' => 'false', 'display_name' => 'Invalid' }] }
  #  Returns
  #  { en: [{ 'id' => 'true', 'display_name' => 'Valid' }, { 'id' => 'false', 'display_name' => 'Invalid' } ] }
  def self.merge_i18n_options(options1, options2)
    merged_props = (options1 || {}).deep_dup
    return merged_props unless options2.present?

    options2.keys.each do |key|
      next unless options2[key].present?

      if options1[key].present?
        options1_by_id = options1[key].inject({}) { |acc, val| acc.merge(val['id']  => val) }
        options2_by_id = options2[key].inject({}) { |acc, val| acc.merge(val['id']  => val) }

        options2_by_id.keys.each_with_index do |key_order, index|
          if options1_by_id[key_order].nil?
            merged_props[key][index] = options2_by_id[key_order]
          else
            merged_props[key][index] = options1_by_id[key_order].merge(options2_by_id[key_order])
          end
        end
        old_values = options1_by_id.except(*merged_props[key].map { |old_id| old_id['id'] }).values
        merged_props[key] = merged_props[key] + old_values
      else
        merged_props[key] = options2[key]
      end
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
  #  Assumming the languages [ :en , :es, :fr ] are available
  #  Given the keys and source
  #  (['name'], { 'name' => { 'en' => "Lastname", 'es' => "Apellido" } })
  #  Returns
  #  { 'name' => { 'en' => "Lastname", 'es' => "Apellido", 'fr' => "" } }
  def self.fill_keys(keys, source)
    keys = keys.map(&:to_s) if source.keys.first.is_a?(String)

    keys.each do |key|
      source[key] = self.fill_with_locales(source[key]) if source[key].present?
    end

    source
  end

  #  Fill the source with all the available locales. If a locale is not
  #  present in source then is set to empty
  #  Assumming the languages [ :en, :es, :fr ] are available
  #  Given thesource
  #  { 'en' => "Lastname", 'es' => "Apellido" } }
  #  Returns
  #  { 'en' => "Lastname", 'es' => "Apellido", 'fr' => "" }
  def self.fill_with_locales(source)
    locales = I18n.available_locales.map do |locale|
      locale = locale.to_s if source.keys.first.is_a?(String)
      { locale => "" }
    end.inject(&:merge)

    locales.merge(source)
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

    def self.fill_options2(options)
    locales = I18n.available_locales.map do |locale|
      locale = locale.to_s if options.keys.first.is_a?(String)
      { locale => '' }
    end.inject(&:merge)
    locales.merge(options)
  end

  #  Fill the lookups value options hash with all the available locales. If a locale is
  #  not present in the hash, then is set to an empty array.
  #  Assumming the languages [ :en, :es, :fr ] are available.
  #  Given the options
  #    {
  #      "en" => [
  #        { "id"=>"1", "display_text"=>"Country"},
  #        { "id"=>"2", "display_text"=>"City"}
  #      ],
  #      "es" => [
  #        { "id"=>"1", "display_text"=>"Pais"},
  #        {"id"=>"2", "display_text"=>"Ciudad"}
  #      ]
  #    }
  #  Returns
  # [
  #  {"id"=>"1",
  #    "display_text" => {
  #      "en"=>"Country",
  #      "es"=>"Pais",
  #      "fr"=>""
  #    }
  #  },
  #  {"id"=>"2",
  #     "display_text" => {
  #       "en"=>"City",
  #       "es"=>"Ciudad",
  #       "fr"=>""
  #     }
  #   }
  # ]
  def self.fill_lookups_options(options)
    locales = I18n.available_locales.map {|l| {l.to_s => ""}}

    options_merged = options.inject([]) do |acc, (k, v)|
      v.each do |value|
        new_hash = {}
        new_hash['id'] = value['id']
        new_hash['display_text'] = {k => value['display_text']}
        acc << new_hash
      end
      acc
    end.group_by {|h| h['id'] }

    final_options = options_merged.inject([]) do |acum, (k, v)|
      new_display_text = v.inject([]) do |a, (k, v)|
        a << k['display_text'];
        a
      end
      acum << { 'id' => k, 'display_text' => (locales + new_display_text).flatten.inject(&:merge) }
    end

    final_options
  end


  #  Given the options
  # [
  #  {
  #    "id"=>"1",
  #    "display_text" => {
  #      "en"=>"Country",
  #      "es"=>"Pais",
  #      "fr"=>""
  #    }
  #  },
  #  {
  #    "id"=>"2",
  #    "display_text" => {
  #      "en"=>"City",
  #      "es"=>"Ciudad",
  #      "fr"=>""
  #    }
  #   }
  # ]
  #  Returns
  #    {
  #      "en" => [
  #        { "id"=>"1", "display_text"=>"Country" },
  #        { "id"=>"2", "display_text"=>"City" }
  #      ],
  #      "es" => [
  #        { "id"=>"1", "display_text"=>"Pais" },
  #        { "id"=>"2", "display_text"=>"Ciudad" }
  #      ]
  #    }

  def self.to_localized_options(options)
    return if options.blank?

    I18n.available_locales.inject({}) do |acc, locale|
      locale_options = options.select { |option| option.dig('display_text', locale.to_s).present? }
                              .map { |option| option.merge('display_text' => option['display_text'][locale.to_s]) }

      locale_options_id = locale_options.map { |option| option['id'] }
      delete_values = options.select { |option| option['_delete'].present? && locale_options_id.exclude?(option['id']) }
      locale_options += delete_values

      locale_options.present? ? acc.merge(locale.to_s => locale_options) : acc
    end
  end
end
