# frozen_string_literal: true

json.data do
  json.id @current_record.id
  json.record do
    json.id @record.id
    json.case_id_display @record.case_id_display
    json.family_member_id @record.family_member_id
  end
end
