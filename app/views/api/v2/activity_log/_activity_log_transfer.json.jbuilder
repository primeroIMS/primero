# frozen_string_literal: true

json.partial! 'api/v2/activity_log/activity_log', activity_log: activity_log
json.transfer_status activity_log.record_changes.dig('transfer_status')
json.type ActivityLog::TYPE_TRANSFER
