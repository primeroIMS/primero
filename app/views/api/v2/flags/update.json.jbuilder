json.data do
  json.partial! 'api/v2/flags/flag', flag: @flag, updates_for_record: @updated_field_names
end
