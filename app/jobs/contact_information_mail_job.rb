# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Job for enqueuing notifications for Contact Information
class ContactInformationMailJob < ApplicationJob
  queue_as :mailer

  def perform(notification_type)
    ContactInformationMailer.notify(notification_type).deliver_now
  end
end
