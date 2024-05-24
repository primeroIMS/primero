# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id lookup.id
json.unique_id lookup.unique_id
json.name FieldI18nService.fill_with_locales(lookup.name_i18n)
json.locked lookup.locked
json.values FieldI18nService.fill_lookups_options(lookup.lookup_values_i18n)
