class TransitionNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(transition_type, record_class, record_id, transition_id, host_url)
    NotificationMailer.transition_notify(transition_type, record_class, record_id, transition_id, host_url).deliver_later
  end
end