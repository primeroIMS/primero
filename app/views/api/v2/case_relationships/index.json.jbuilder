# frozen_string_literal: true

json.data do
  json.array! @case_relationships do |case_relationship|
    json.partial! 'api/v2/case_relationships/case_relationship', case_relationship:
  end
end
