# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.id @current_record.id

  if @selected_field_names.include?('family_members')
    json.merge! RecordDataService.new.embed_family_members_user_access(
      { 'family_members' => @current_record.family_members }, @current_record, @selected_field_names, current_user
    )
  end

  json.record do
    json.id @record.id
    json.case_id_display @record.case_id_display
    json.family_member_id @record.family_member_id
  end
end
