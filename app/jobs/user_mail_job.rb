# frozen_string_literal: true

# Job for enqueuing notifications about changes to the User account
class UserMailJob < ApplicationJob
  queue_as :mailer

  def perform(user_id, admin_user_id)
    UserMailer.welcome(user_id, admin_user_id).deliver_later
  end
end