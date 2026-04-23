# frozen_string_literal: true

# Job that sends out emails and webpush notifications for transitions
class TransitionNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(transition_id)
    transition_notification = TransitionNotificationService.new(transition_id)
    RecordActionMailer.transition_notify(transition_notification).deliver_now
    RecordActionWebpushNotifier.transition_notify(transition_notification)
  end
end
