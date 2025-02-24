# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job to remove expired sessions from db
class SessionExpiryJob < ApplicationJob
  queue_as :default

  # TODO: This needs to be aligned with the session expiry setting in initializers/session_store.rb.
  # The value needs to be 1 hour (from session setting) + 10 minutes
  def perform
    Session.where(['updated_at < ?', 20.minutes.ago]).delete_all
  end
end
