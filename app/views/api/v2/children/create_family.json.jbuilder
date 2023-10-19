# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.id @current_record.id
  json.family_id @current_record.family_id if @selected_field_names.include?('family_id')
  json.family_number @current_record.family_number if @selected_field_names.include?('family_number')
  json.family_member_id @current_record.family_member_id if @selected_field_names.include?('family_member_id')

  if @selected_field_names.include?('family_details_section')
    json.family_details_section @current_record.family_members_details
  end

  json.record do
    json.id @record.id
    json.case_id_display @record.case_id_display
    json.family_member_id @record.family_member_id if @selected_field_names.include?('family_member_id')
  end
end
