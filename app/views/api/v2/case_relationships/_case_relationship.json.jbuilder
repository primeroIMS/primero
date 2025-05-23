# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

json.merge!(
  id: case_relationship.id,
  case_id: case_relationship.case_id(@record.id),
  relationship_type: case_relationship.relationship(@record.id),
  data: {}
)
