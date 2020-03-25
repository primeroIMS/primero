# frozen_string_literal: true

json.merge!(
  transition.attributes.map do |attr, value|
    if attr == 'record_type'
      [attr, Record.map_name(value)]
    else
      [attr, value]
    end
  end.to_h.compact_deep
)
record_access_denied = !current_user.can?(:read, transition.record)
json.record_access_denied record_access_denied

if local_assigns.key? :updates_for_record
  unless record_access_denied
    json.record do
      json.partial! 'api/v2/records/record',
                    record: transition.record,
                    selected_field_names: updates_for_record
    end
  end
end
