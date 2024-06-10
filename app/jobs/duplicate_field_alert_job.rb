# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Generate alerts for duplicated fields
class DuplicateFieldAlertJob < ApplicationJob
  queue_as :api

  def perform(record_id, record_type, alert_on_duplicate)
    record = PrimeroModelService.to_model(record_type)&.find_by(id: record_id)
    return unless record.present?

    DuplicatedFieldAlertService.create_or_remove_alerts!(record, alert_on_duplicate)
  end
end
