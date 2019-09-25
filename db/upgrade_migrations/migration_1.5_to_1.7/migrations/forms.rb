puts 'Migrating (i18n): FormSections'

include MigrationHelper

default_changes = [
    {form: 'basic_identity', field: 'child_status', value: Record::STATUS_OPEN},
    {form: 'basic_identity', field: 'registration_date', value: 'today'},
    {form: 'other_reportable_fields_case', field: 'record_state', value: true},
    {form: 'cp_incident_form', field: 'status', value: Record::STATUS_OPEN},
    {form: 'cp_other_reportable_fields', field: 'record_state', value: true},
    {form: 'gbv_incident_form', field: 'status', value: Record::STATUS_OPEN},
    {form: 'other_reportable_fields_incident', field: 'record_state', value: true},
    {form: 'tracing_request_inquirer', field: 'inquiry_date', value: 'today'},
    {form: 'tracing_request_inquirer', field: 'inquiry_date', value: Record::STATUS_OPEN},
    {form: 'other_reportable_fields_tracing_request', field: 'record_state', value: true}
]

field_localized_properties = Field.localized_properties.map(&:to_s)
form_localized_properties = FormSection.localized_properties.map(&:to_s)

FormSection.all.rows.map {|r| FormSection.database.get(r["id"]) }.each do |fs|
  fs['base_language'] = FormSection::DEFAULT_BASE_LANGUAGE
  fs['fields'].each do |field|
    field['base_language'] = FormSection::DEFAULT_BASE_LANGUAGE
    default_change = default_changes.select {|dc| dc[:form] == fs['unique_id'] && dc[:field] == field['name']}.first
    field['selected_value'] = default_change[:value] if default_change.present?

    if field['option_strings_source'] =~ /\Alookup/
      lookup = field['option_strings_source'].match(/\w+\b(?<!lookup).*/)
      field['option_strings_source'] = "lookup lookup-#{lookup[0].underscore.dasherize}" if lookup.present?
    else
      if field['option_strings_text_en'].present?
        base_value = MigrationHelper.generate_keyed_value(field['option_strings_text_en'])

        MigrationHelper.create_locales do |locale|
          field["option_strings_text_#{locale}"] = field["option_strings_text_#{locale}"].present? ?
                                                        MigrationHelper.translate_keyed_value(field["option_strings_text_#{locale}"], base_value) :
                                                        base_value
        end
      end
    end

    #Remove all the stuff related to locales that are not part of the configured locales for this system
    field_localized_properties.each {|p| MigrationHelper.discard_locales(field, p)}
  end

  #Remove all the stuff related to locales that are not part of the configured locales for this system
  form_localized_properties.each {|p| MigrationHelper.discard_locales(fs, p)}

  fs.save
end

