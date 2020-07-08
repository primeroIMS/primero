json.id record.id
json.enabled record.record_state
json.merge! RecordDataService.data(record, current_user, selected_field_names)
