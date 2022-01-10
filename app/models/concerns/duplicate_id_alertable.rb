# frozen_string_literal: true

# Alerts for duplicate id fields
module DuplicateIdAlertable
  extend ActiveSupport::Concern

  DUPLICATE_FIELD = 'duplicate_field'

  included do
    searchable do
      string :current_alert_types, multiple: true
    end

    after_save :perform_duplicate_field_alert
  end

  def perform_duplicate_field_alert
    return unless alerts_on_duplicate.present?

    record_alerts_on_duplicate = alerts_on_duplicate[Record.map_name(self.class.name)]

    return unless record_alerts_on_duplicate.present?

    changed_field_names = saved_changes_to_record.keys

    alerts_on_changed_duplicate = record_alerts_on_duplicate.select do |field_name|
      changed_field_names.include?(field_name)
    end

    DuplicateFieldAlertJob.perform_later(id, self.class.name, alerts_on_changed_duplicate)
  end

  def alerts_on_duplicate
    @system_settings ||= SystemSettings.current
    @system_settings&.duplicate_field_to_form
  end
end
