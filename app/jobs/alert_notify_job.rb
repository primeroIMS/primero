# frozen_string_literal: true

# Job for enqueuing notifications about changes to the User account
class AlertNotifyJob < ApplicationJob
  queue_as :mailer

  def perform(alert_id)
    NotificationMailer.alert_notify(alert_id).deliver_now
  end
end
