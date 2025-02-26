# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job to remove expired sessions from db
class SessionExpiryJob < ApplicationJob
  queue_as :default

  def perform
    Session.where(
      ['updated_at < ?', (Rails.application.config.native_session_timeout + 20).minutes.ago]
    ).delete_all
  end
end
