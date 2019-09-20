json.data do
  json.array! @transitions do |transition|
    json.partial! 'api/v2/transitions/transition',
                  transition: transition,
                  updates_for_record: @updated_field_names_hash[transition.record_id]
  end
end