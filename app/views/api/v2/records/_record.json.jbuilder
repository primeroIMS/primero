# frozen_string_literal: true

json.id record.id
json.enabled record.record_state
json.last_updated_at record.last_updated_at
json.merge! RecordDataService.data(record, current_user, selected_field_names)
