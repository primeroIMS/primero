# frozen_string_literal: true

# Job that sends out emnail notifications for transitions
class TransitionNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(transition_id)
    NotificationMailer.transition_notify(transition_id).deliver_now
  end
end
