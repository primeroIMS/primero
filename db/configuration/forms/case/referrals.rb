# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FormSection.create_or_update!(
  unique_id: 'referral',
  parent_form: 'case',
  visible: true,
  order_form_group: 0,
  order: 4,
  form_group_id: 'record_information',
  fields: [],
  name_en: 'Referral',
  description_en: 'Referral',
  core_form: true,
  is_first_tab: true
)
