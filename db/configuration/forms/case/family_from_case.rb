# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FormSection.create_or_update!(
  unique_id: 'family_from_case',
  parent_form: 'case',
  visible: true,
  order_form_group: 1,
  order: 4,
  form_group_id: 'identification_registration',
  is_first_tab: true,
  fields: [],
  name_en: 'Family Details',
  description_en: 'Family Details',
  core_form: true
)
