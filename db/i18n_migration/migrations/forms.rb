include MigrationHelper

puts 'Migrating (i81n): FormSections'

FormSection.all.rows.map {|r| FormSection.database.get(r["id"]) }.each do |fs|
  fs['fields'].each do |field|
    if field['type'] == 'check_boxes'
      field['type'] = Field::FIELD_DISPLAY_TYPES['tick_box']

      value = MigrationHelper.generate_keyed_value('Yes')

      Primero::Application::locales.each do |locale|
        field["tick_box_label_#{locale}"] = value
      end
    end

    if field["option_strings_text_#{I18n.default_locale}"].present?
      value = MigrationHelper.generate_keyed_value(field['option_strings_text_en'])

      Primero::Application::locales.each do |locale|
        field["option_strings_text_#{locale}"] = value
      end
    end
  end

  fs.save
end

