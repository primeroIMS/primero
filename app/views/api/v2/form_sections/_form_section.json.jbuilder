# frozen_string_literal: true

form_hash = FieldI18nService.strip_i18n_suffix(form.as_json.compact)
fields = form.fields.map do |field|
  if field.option_strings_text_i18n.present?
    field.option_strings_text_i18n = FieldI18nService.fill_lookups_options(field.option_strings_text_i18n)
  end
  FieldI18nService.fill_keys(
    Field.localized_properties.reject { |lp| lp == :option_strings_text },
    FieldI18nService.strip_i18n_suffix(field.as_json.compact)
  )
end
module_ids = form.primero_modules.pluck(:unique_id)
json.merge! FieldI18nService.fill_keys(
  FormSection.localized_properties + ['form_group_name'],
  form_hash.merge(
    'fields' => fields,
    'module_ids' => module_ids,
    'collapsed_field_names' => form.collapsed_fields.order(:order).pluck(:name)
  )
)
