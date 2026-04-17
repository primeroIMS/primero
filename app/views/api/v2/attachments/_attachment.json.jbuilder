# frozen_string_literal: true

json.merge!(
  attachment.to_h_api.compact
)

if local_assigns.key?(:updates_for_record)
  json.record do
    json.partial! 'api/v2/records/record',
                  record: attachment.record,
                  selected_field_names: updates_for_record
  end
end
