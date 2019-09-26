json.data do
  json.partial! 'api/v2/transitions/transition',
                transition: @transition, updates_for_record: @updated_field_names
end