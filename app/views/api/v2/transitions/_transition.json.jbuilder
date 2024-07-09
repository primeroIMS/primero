# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.merge!(
  transition.attributes.to_h do |attr, value|
    if attr == 'record_type'
      [attr, PrimeroModelService.to_name(value)]
    else
      [attr, value]
    end
  end.compact_deep
)
record_access_denied = !current_user.can?(:read, transition.record)
json.record_access_denied record_access_denied
json.user_can_accept_or_reject transition.user_can_accept_or_reject?(current_user)

if local_assigns.key?(:updates_for_record) && !record_access_denied
  json.record do
    json.partial! 'api/v2/records/record',
                  record: transition.record,
                  selected_field_names: updates_for_record
  end
end
