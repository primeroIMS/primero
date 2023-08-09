# frozen_string_literal: true

# Job that sends out emails and webpush notifications for transitions
class TransitionNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(transition_id)
    NotificationMailer.transition_notify(transition_id).deliver_now
    NotificationService.notify_transition(transition_id)
  end
end
