# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Alerts support for Transitions
module TransitionAlertable
  extend ActiveSupport::Concern

  included do
    after_create :add_alert_on_record
    after_update :remove_alert_on_record
  end

  def alert_form_unique_id
    raise NotImplementedError
  end

  def was_resolved?
    saved_changes['status'].present? && [
      Transition::STATUS_ACCEPTED, Transition::STATUS_REJECTED, Transition::STATUS_DONE, Transition::STATUS_REVOKED
    ].include?(saved_changes['status'].last)
  end

  def remove_alert_on_record
    return unless record.present? && was_resolved?

    record.remove_alert(self.class.name.downcase)
  end

  def add_alert_on_record
    return unless record.present? && in_progress?

    record.add_transition_alert(transitioned_to_user, self.class.name.downcase, alert_form_unique_id)
  end
end
