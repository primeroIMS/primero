# frozen_string_literal: true

json.data do
  json.record_id @record.id
  json.record_type @record.class.parent_form
  json.synced_at @record.synced_at
  json.sync_status @record.sync_status
end
