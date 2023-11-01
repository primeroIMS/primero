# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Alerts support for Transitions
module TransitionAlertable
  extend ActiveSupport::Concern

  included do
    after_create :add_alert_on_record
  end

  def alert_form_unique_id
    raise NotImplementedError
  end

  def add_alert_on_record
    return unless record.present?

    record.add_transition_alert(transitioned_to_user, self.class.name.downcase, alert_form_unique_id)
  end
end
