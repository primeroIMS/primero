# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

FormSection.create_or_update!(
  unique_id: 'summary',
  parent_form: 'case',
  visible: true,
  order_form_group: 130,
  order: 1,
  form_group_id: 'tracing',
  fields: [],
  name_en: 'Summary',
  description_en: 'Summary'
)
