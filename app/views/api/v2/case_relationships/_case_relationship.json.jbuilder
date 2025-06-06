# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

record = case_relationship.related_case(@record.id)
selected_fields = record.module.record_list_headers[:cases] + ['module_id']

json.merge!(
  id: case_relationship.id,
  case_id: case_relationship.case_id(@record.id),
  relationship_type: case_relationship.relationship(@record.id),
  primary: case_relationship.primary,
  data: @record_data_service.data(record, current_user, selected_fields)
)
