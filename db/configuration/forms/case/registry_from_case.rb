# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FormSection.create_or_update!(
  unique_id: 'registry_from_case',
  parent_form: 'case',
  visible: false,
  order_form_group: 1,
  order: 3,
  form_group_id: 'identification_registration',
  is_first_tab: true,
  fields: [],
  name_en: 'Registry Details',
  description_en: 'Registry from case',
  core_form: true
)
