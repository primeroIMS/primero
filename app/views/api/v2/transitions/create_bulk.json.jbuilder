# frozen_string_literal: true
json.data do
  json.array! @transitions do |transition|
    json.partial! 'api/v2/transitions/transition',
                  transition: transition,
                  updates_for_record: @updated_field_names_hash[transition.record_id]
  end
end
if @errors.present?
  json.errors do
    json.array! @errors do |error|
      json.partial! 'api/v2/errors/error', error: error
    end
  end
end
