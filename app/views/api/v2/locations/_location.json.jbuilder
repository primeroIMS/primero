json.id location.id
json.code location.location_code
json.type location.type
json.name FieldI18nService.fill_keys([:name], FieldI18nService.strip_i18n_suffix(location.slice(:name_i18n)))


if @with_hierarchy
  json.admin_level location.admin_level
  json.merge! FieldI18nService.fill_keys([:name, :placename], FieldI18nService.strip_i18n_suffix(location.slice(:name_i18n, :placename_i18n)))
  json.hierarchy location.hierarchy
end
