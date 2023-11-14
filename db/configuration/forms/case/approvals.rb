# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FormSection.create_or_update!(
  unique_id: 'approvals',
  parent_form: 'case',
  visible: true,
  order_form_group: 0,
  order: 2,
  form_group_id: 'record_information',
  fields: [],
  name_en: 'Approvals',
  description_en: 'Approvals',
  core_form: true
)
