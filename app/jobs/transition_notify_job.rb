# frozen_string_literal: true

# Job that sends out emnail notifications for transitions
class TransitionNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(transition_id)
    system_settings = SystemSettings.current
    NotificationMailer.transition_notify(transition_id).deliver_now if system_settings.notification_email_enabled
  end
end
