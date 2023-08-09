# frozen_string_literal: true

# Service for transitions notification logic
class TransitionNotificationService
  attr_accessor :transition_id

  def initialize(transition_id)
    self.transition_id = transition_id
  end

  def transition
    @transition ||= Transition.find_by(id: transition_id)
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

  def record
    @record ||= transition&.record
  end
end
