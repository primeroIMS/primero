json.data do
  json.partial! 'api/v2/records/record', record: @record, selected_field_names: @updated_field_names
end