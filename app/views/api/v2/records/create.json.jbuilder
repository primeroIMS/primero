json.data do
  json.partial! 'api/v2/records/record', record: @record, selected_field_names: @permitted_field_names
end