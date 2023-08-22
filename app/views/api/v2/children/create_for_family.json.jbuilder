# frozen_string_literal: true

json.data do
  json.id @current_record.id
  json.family_id @current_record.family_id
  json.record do
    json.partial! 'api/v2/records/record',
                  record: @record,
                  selected_field_names: @updated_field_names
  end
end
