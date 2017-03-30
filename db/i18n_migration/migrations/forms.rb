puts 'Migrating (i81n): FormSections'

FormSection.all.rows.map {|r| FormSection.database.get(r["id"]) }.each do |fs|
  fs['fields'].each do |field|
    case field['type']
    when 'check_boxes'
      field['type'] = Field::FIELD_DISPLAY_TYPES['tick_box']

      value = MigrationHelper.generate_keyed_value('Yes')

      MigrationHelper.create_locales do |locale|
        field["tick_box_label_#{locale}"] = value
        field.delete("option_strings_text_#{locale}")
      end
    when 'radio_button'
      field['options_string_source'] = "lookup lookup-yes-no"

      MigrationHelper.create_locales do |locale|
        field.delete("option_strings_text_#{locale}")
      end
    else
      if field['option_strings_source'] =~ /\Alookup/
        lookup = field['option_strings_source'].match(/\w+\b(?<!lookup).*/)
        field['option_strings_source'] = "lookup lookup-#{lookup[0].downcase.parameterize}" if lookup.present?
      else
        if field['option_strings_text_en'].present?
          value = MigrationHelper.generate_keyed_value(field['option_strings_text_en'])

          MigrationHelper.create_locales do |locale|
            field["option_strings_text_#{locale}"] = value
          end
        end
      end
    end
  end

  fs.save
end

