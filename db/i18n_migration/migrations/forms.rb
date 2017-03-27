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

FormSection.all.rows.map {|r| FormSection.database.get(r["id"]) }.each do |fs|
  fs['fields'].each do |field|
    if field['type'] == 'check_boxes'
      field['type'] = Field::FIELD_DISPLAY_TYPES['tick_box']
      field['tick_box_label'] = 'Yes'
    end

    if field["option_strings_text_#{I18n.default_locale}"].present?
      value = generate_keyed_value(field['option_strings_text_en'])

      Primero::Application::locales.each do |locale|
        field["option_strings_text_#{locale}"] = value
      end
    end
  end

  fs.save
end

