# frozen_string_literal: true

json.record_type activity_log.record_type
json.record_id activity_log.record_id
json.record_owner activity_log.record.owned_by
json.performed_by activity_log.user_name
json.datetime activity_log.datetime
json.record_access_denied current_user.cannot?(:read, activity_log.record)

transfer_status = activity_log.record_changes.dig('transfer_status')

if transfer_status.present?
  json.transfer_status transfer_status
  json.type ActivityLog::TYPE_TRANSFER
end
