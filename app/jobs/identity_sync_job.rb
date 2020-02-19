# frozen_string_literal: true

# Asynchronously handle updates to the User records with external
# identity management services such as identity providers and MDM
class IdentitySyncJob < ApplicationJob
  queue_as :api

  def perform(user_id, admin_user_id)
    user = User.find_by(id: user_id)
    result = IdentitySyncService.sync!(user)
    result[:one_time_password].present? &&
      UserMailer.welcome(user_id, admin_user_id, result[:one_time_password])
  rescue StandardError => e
    Rails.logger.error("Error syncing User with id #{user_id}. Error: #{e.message}")
  end
end