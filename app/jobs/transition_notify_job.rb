class TransitionNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(transition_id)
    system_settings = SystemSettings.current
    if system_settings.notification_email_enabled
      NotificationMailer.transition_notify(transition_id).deliver_later
    end
  end
end