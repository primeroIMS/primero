# frozen_string_literal: true

json.id location.id
json.code location.location_code
json.type location.type
json.disabled location.disabled
json.merge! FieldI18nService.fill_keys([:name], name: location.name_i18n)

if with_hierarchy
  json.admin_level location.admin_level
  json.merge! FieldI18nService.fill_keys([:placename], placename: location.placename_i18n)
  json.hierarchy location.hierarchy
end
