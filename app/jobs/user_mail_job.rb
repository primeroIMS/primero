# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job for enqueuing notifications about changes to the User account
class UserMailJob < ApplicationJob
  queue_as :mailer

  def perform(user_id)
    UserMailer.welcome(user_id).deliver_now
  end
end
