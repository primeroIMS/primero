# frozen_string_literal: true

json.data do
  json.id @current_record.id
  json.family_id @current_record.family_id if @selected_field_names.include?('family_id')
  json.family_number @current_record.family_number if @selected_field_names.include?('family_number')
  json.family_member_id @current_record.family_member_id if @selected_field_names.include?('family_member_id')
  json.record do
    json.partial! 'api/v2/records/record',
                  record: @record,
                  selected_field_names: @updated_field_names
  end
end
