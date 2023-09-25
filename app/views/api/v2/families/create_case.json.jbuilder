# frozen_string_literal: true

json.data do
  json.id @current_record.id
  json.family_members @current_record.family_members if @selected_field_names.include?('family_members')
  json.record do
    json.id @record.id
    json.case_id_display @record.case_id_display
    json.family_member_id @record.family_member_id
  end
end
