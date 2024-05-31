# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service for transitions notification logic
class TransitionNotificationService
  attr_accessor :transition_id

  def initialize(transition_id)
    self.transition_id = transition_id
  end

  def transition
    @transition ||= Transition.find_by(id: transition_id)
    Rails.logger.error("Transition #{transition_id} not found.") if @transition.blank?
    @transition
  end

  def locale
    @locale ||= transition&.transitioned_to_user&.locale || I18n.locale
  end

  def subject
    I18n.t(
      "email_notification.#{transition.key}_subject",
      record_type: I18n.t("forms.record_types.#{record.class&.parent_form}", locale:),
      id: record&.short_id,
      locale:
    )
  end

  def transitioned_to
    @transitioned_to ||= transition&.transitioned_to_user
  end

  def record
    @record ||= transition&.record
  end
end
