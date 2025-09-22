# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Job for enqueuing notifications for Administrator
class AdministratorNotificationMailJob < ApplicationJob
  queue_as :mailer

  def perform(notification_type)
    AdministratorNotificationMailer.notify(notification_type).deliver_now
  end
end
