# frozen_string_literal: true

# Job for enqueuing notifications for Administrator
class AdministratorNotificationMailJob < ApplicationJob
  queue_as :mailer

  def perform(notification_type)
    AdministratorNotificationMailer.notify(notification_type).deliver_now
  end
end
