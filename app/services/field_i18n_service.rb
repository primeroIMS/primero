# frozen_string_literal: true

# Methods to handle internationalization of the fields
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
    unlocalized_params = params.reject { |k, _v| localized_props.include?(k) }
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
    localized_props1 = fields1.select { |k, _v| k.slice(-4, 4) == 'i18n' }
    localized_props2 = fields2.select { |k, _v| k.slice(-4, 4) == 'i18n' }
    merged_props = {}
    localized_props1.each do |name, value|
      value2 = localized_props2.try(:[], name) || {}
      next if value.blank? && value2.blank?

      merged_props[name] = value2.present? ? value.try(:merge, value2) || value2 : value
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
    source.map do |k, v|
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
      next unless source[key].present?

      source[key] = key == 'option_strings_text' ? fill_options(source[key]) : fill_with_locales(source[key])
    end

    source
  end

  #  Fill the source with all the available locales. If a locale is not
  #  present in source then is set to an empty string
  #  Assumming the languages [ :en, :es, :fr ] are available
  #  Given thesource
  #  { 'en' => 'Lastname', 'es' => 'Apellido' }
  #  Returns
  #  { 'en' => 'Lastname', 'es' => 'Apellido', 'fr' => '' }
  def self.fill_with_locales(source)
    locales = I18n.available_locales.map do |locale|
      locale = locale.to_s if source.keys.first.is_a?(String)
      { locale => '' }
    end.inject(&:merge)

    locales.merge(source)
  end

  #  Fill the options hash with all the available locales. If a locale is
  #  not present in the hash, then is set to an empty array.
  #  Assumming the languages [ :en, :es, :fr ] are available.
  #  Given the options
  #  [
  #    {"id"=>"true", "display_text"=>{"en"=>"True", "es": "Verdadero"}}
  #  ]
  #  Returns
  #  {
  #    en: [{ id: "true", display_name: "True" }],
  #    es: [{ id: "true", display_name: "Verdadero" }],
  #    fr: []
  #  }
  def self.fill_options(options)
    I18n.available_locales.each_with_object({}) do |locale, acc|
      acc[locale.to_s] = []
      options.map(&:with_indifferent_access).each do |option|
        next if option.dig('display_text', locale).nil?

        value = {}.with_indifferent_access
        value['id'] = option.dig('id')
        value['display_text'] = option.dig('display_text', locale)

        acc[locale.to_s] << value
      end
    end
  end

  #  Fill the lookups value options hash with all the available locales. If a locale is
  #  not present in the original option, then is set to an empty string.
  #  Assumming the languages [ :en, :es, :fr ] are available.
  #  Given the options
  # [
  #  {"id"=>"1",
  #    "display_text" => {
  #      "en"=>"Country",
  #      "es"=>"Pais"
  #    }
  #  },
  #  {"id"=>"2",
  #     "display_text" => {
  #       "en"=>"City",
  #       "es"=>"Ciudad"
  #     }
  #   }
  # ]
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
    options.each do |option|
      I18n.available_locales.each do |locale|
        next if option['display_text'][locale.to_s].present?

        option['display_text'][locale.to_s] = ''
      end
    end
    options
  end

  #  Fill the options hash with all the available locales. If a locale is
  #  not present in the hash, then is set to an empty string.
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
  #  {
  #    "id"=>"1",
  #    "display_text" => {
  #      "en"=>"Country",
  #      "es"=>"Pais"
  #    }
  #  },
  #  {
  #     "id"=>"2",
  #     "display_text" => {
  #       "en"=>"City",
  #       "es"=>"Ciudad"
  #     }
  #   }
  # ]
  def self.convert_options(options)
    options.to_h.each_with_object([]) do |(key, opts), acc|
      opts.each do |value|
        current_value = acc.find{ |vv| vv['id'] == value['id'] }
        if current_value.present?
          current_value['display_text'][key] = value['display_text']
          next
        end
        new_hash = {}
        new_hash['id'] = value['id']
        new_hash['display_text'] = { key => value['display_text'] }
        acc << new_hash
      end
      acc
    end
  end

  #  Fill the options hash with all the available locales. If a locale is
  #  not present in the hash, then is set to an empty array.
  #  Assumming the languages [ :en, :es, :fr ] are available.
  #  Given the options
  #  [
  #    {"id"=>"true", "display_text"=>{"en"=>"True", "es": "Verdadero"}}
  #  ]
  #  Returns
  #  {
  #    en: "True",
  #    es: "Verdadero"
  #  }
  def self.fill_names(options)
    I18n.available_locales.each_with_object({}) do |locale, acc|
      acc[locale.to_s] = []
      options.map(&:with_indifferent_access).each do |option|
        next if option.dig('display_text', locale).nil?

        acc[locale.to_s] = option.dig('display_text', locale)
      end
    end
  end

  #  Assumming the languages [ :en, :ar, :fr ] are available.
  #  Given the value
  # {
  #   "ar": {
  #     "closure": "Closure-AR",
  #     "case_plan": "Case Plan-AR",
  #     "assessment": "SER-AR"
  #   },
  #   "en": {
  #     "closure": "Closure",
  #     "case_plan": "Case Plan",
  #     "assessment": "SER"
  #   }
  # }
  #  Returns
  # {
  #   "closure"=>{
  #     "en"=>"Closure",
  #     "fr"=>"",
  #     "ar"=>"Closure-AR"
  #   },
  #   "case_plan"=>{
  #     "en"=>"Case Plan",
  #     "fr"=>"",
  #     "ar"=>"Case Plan-AR"
  #   },
  #   "assessment"=>{
  #     "en"=>"SER",
  #     "fr"=>"",
  #     "ar"=>"SER-AR",
  #   }
  # }
  # TODO: Delete once we have converted system settings approvals to the new format
  def self.to_localized_values(field)
    return unless field

    values_localized = field.each_with_object({}) do |(locale, values), acc|
      values.map do |key, value|
        acc[key] ||= I18n.available_locales.collect { |l| [l.to_s, ''] }.to_h
        acc[key][locale] = value
      end
      acc
    end
    values_localized
  end
end
