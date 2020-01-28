# frozen_string_literal: true

json.id agency.id
json.unique_id agency.unique_id
json.agency_code agency.agency_code
json.order agency.order
json.name FieldI18nService.fill_with_locales(agency.name_i18n)
json.description FieldI18nService.fill_with_locales(agency.description_i18n || {})
json.telephone agency.telephone
json.services agency.services
json.logo_enabled agency.logo_enabled
json.disabled agency.disabled
