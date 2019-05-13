json.data do
  json.partial! 'child', record: @record, selected_field_names: @selected_field_names
end