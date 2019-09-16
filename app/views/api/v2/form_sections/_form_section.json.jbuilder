form_hash = FieldI18nService.strip_i18n_suffix(form.as_json.compact)
fields = form.fields.map do |f|
  FieldI18nService.fill_keys(
    Field.localized_properties,
    FieldI18nService.strip_i18n_suffix(f.as_json.compact)
  )
end
module_ids = form.primero_modules.map(&:unique_id)
json.merge! FieldI18nService.fill_keys(
  FormSection.localized_properties + ['form_group_name'],
  form_hash.merge({
    "form_group_name" => form.form_group_name_all,
    "fields" => fields,
    "module_ids" =>  module_ids
  })
)