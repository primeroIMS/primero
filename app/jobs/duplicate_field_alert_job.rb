# frozen_string_literal: true

# Generate alerts for duplicated fields
class DuplicateFieldAlertJob < ApplicationJob
  queue_as :api

  def perform(record_id, record_type, alert_on_duplicate)
    model = Record.model_from_name(record_type)
    record = model.find_by(id: record_id)

    alert_on_duplicate.each do |field_name, form_name|
      next unless record.duplicates_field?(field_name)

      Alert.where(alert_for: Alertable::DUPLICATE_FIELD, type: field_name).each(&:destroy!)

      record.add_alert(alert_for: Alertable::DUPLICATE_FIELD, date: Date.today, type: field_name, form_sidebar_id: form_name)
    end
  end
end
