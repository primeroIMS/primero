puts 'Migrating (i81n): FormSections'

include MigrationHelper

default_changes = [
    {form: 'basic_identity', field: 'child_status', value: Record::STATUS_OPEN},
    {form: 'basic_identity', field: 'registration_date', value: 'now'},
    {form: 'other_reportable_fields_case', field: 'record_state', value: true},
    {form: 'cp_incident_form', field: 'status', value: Record::STATUS_OPEN},
    {form: 'cp_other_reportable_fields', field: 'record_state', value: true},
    {form: 'gbv_incident_form', field: 'status', value: Record::STATUS_OPEN},
    {form: 'other_reportable_fields_incident', field: 'record_state', value: true},
    {form: 'tracing_request_inquirer', field: 'inquiry_date', value: 'now'},
    {form: 'tracing_request_inquirer', field: 'inquiry_date', value: Record::STATUS_OPEN},
    {form: 'other_reportable_fields_tracing_request', field: 'record_state', value: true}
]

FormSection.all.rows.map {|r| FormSection.database.get(r["id"]) }.each do |fs|
  fs['base_language'] = FormSection::DEFAULT_BASE_LANGUAGE
  fs['fields'].each do |field|
    field['base_language'] = FormSection::DEFAULT_BASE_LANGUAGE
    default_change = default_changes.select {|dc| dc[:form] == fs['unique_id'] && dc[:field] == field['name']}.first
    field['selected_value'] = default_change[:value] if default_change.present?

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
        field['option_strings_source'] = "lookup lookup-#{lookup[0].underscore.dasherize}" if lookup.present?
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

