json.merge!(
  id: case_relationship.id,
  case_id: case_relationship.case_id(@record.id),
  relationship_type: case_relationship.relationship(@record.id),
  data: {}
)
