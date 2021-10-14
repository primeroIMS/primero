# frozen_string_literal: true

json.record_type activity_log.record_type
json.record_id activity_log.record_id
json.display_id activity_log.record.display_id
json.performed_by activity_log.user_name
json.datetime activity_log.datetime
json.record_access_denied current_user.cannot?(:read, activity_log.record)

transfer_status = activity_log.record_changes['transfer_status']

if transfer_status.present?
  json.type ActivityLog::TYPE_TRANSFER
  json.transfer do
    json.status transfer_status['to']
    if transfer_status['to'] == Transition::STATUS_ACCEPTED
      json.from activity_log.record_changes.dig('owned_by', 'from')
      json.to activity_log.record_changes.dig('owned_by', 'to')
    end

    if transfer_status['to'] == Transition::STATUS_REJECTED
      json.from activity_log.record.owned_by
      json.to (
        activity_log.record_changes.dig(
          'assigned_user_names',
          'from'
        ) - activity_log.record_changes.dig('assigned_user_names', 'to')
      ).first
    end
  end
end
