# frozen_string_literal: true

# Asynchronously handle updates to the User records with external
# identity management services such as identity providers and MDM
class IdentitySyncJob < ApplicationJob
  queue_as :identity_sync

  def perform(user_id)
    user = User.find_by(id: user_id)
    IdentitySyncService.sync!(user)
    # TODO: trigger mailer with password?
  end
end