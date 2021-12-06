# frozen_string_literal: true

# Generate alerts for duplicated fields
class DuplicateFieldAlertJob < ApplicationJob
  queue_as :api

  def perform(record_id, record_type, alert_on_duplicate)
    record = Record.model_from_name(record_type)&.find_by(id: record_id)
    return unless record.present?

    DuplicatedFieldAlertService.generate_alerts!(record, alert_on_duplicate)
  end
end
