# frozen_string_literal: true

json.merge! flag.attributes
json.name flag&.name
json.short_id flag&.short_id
json.hidden_name flag&.hidden_name
json.owned_by flag&.owned_by
json.owned_by_agency_id flag&.owned_by_agency_id
json.record_type Record.map_name(flag.record_type).pluralize

record_access_denied = !current_user.can?(:read, flag.record)
json.record_access_denied record_access_denied
if local_assigns.key? :updates_for_record
  unless record_access_denied
    json.record do
      json.partial! 'api/v2/records/record',
                    record: flag.record,
                    selected_field_names: updates_for_record
    end
  end
end
