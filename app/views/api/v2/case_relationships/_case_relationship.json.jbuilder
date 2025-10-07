# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

linked_record = case_relationship.related_case(@record.id)

json.merge!(
  id: case_relationship.id,
  case_id: case_relationship.case_id(@record.id),
  relationship_type: case_relationship.relationship(@record.id),
  primary: case_relationship.primary,
  disabled: case_relationship.disabled,
  data: @record_data_service.data(linked_record, current_user, @selected_field_names).merge(
    id: linked_record.id, enabled: linked_record.record_state
  )
)
