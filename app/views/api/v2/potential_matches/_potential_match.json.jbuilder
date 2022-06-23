# frozen_string_literal: true

json.likelihood potential_match.likelihood
json.score potential_match.score
json.case do
  json.id potential_match.child.id
  json.case_id_display potential_match.child.case_id_display
  json.name potential_match.child.name
  json.age potential_match.child.age
  json.sex potential_match.child.sex
  json.owned_by potential_match.child.owned_by
  json.owned_by_agency_id potential_match.child.owned_by_agency_id
  json.photos potential_match.child&.current_photos&.map(&:to_h_api) if current_user.can?(:view_photo, PotentialMatch)
  if current_user.can?(:view_audio, PotentialMatch)
    json.recorded_audio potential_match.child&.current_audios&.map(&:to_h_api)
  end
end
json.trace do
  json.partial! 'api/v2/traces/trace', trace: potential_match.trace
end
json.comparison do
  json.merge!(potential_match.comparison)
end
