# frozen_string_literal: true

json.data do
  json.potential_matches do
    json.array! @potential_matches do |potential_match|
      json.partial! 'api/v2/potential_matches/potential_match', potential_match: potential_match
    end
  end
  json.record do
    json.id @record.id
    json.type Record.map_name(@record.class.name)
  end
end
