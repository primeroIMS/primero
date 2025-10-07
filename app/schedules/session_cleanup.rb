# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job to remove expired sessions from db
class SessionCleanup < PeriodicJob
  def self.reschedule_after
    1.hour
  end

  def perform_rescheduled
    Rails.logger.info 'Expiring stale sessions...'
    cleanup
  rescue StandardError => e
    Rails.logger.error("Error expiring old sessions\n#{e.backtrace}")
  end

  def cleanup
    Session.where(
      ['updated_at < ?', (Rails.application.config.native_session_timeout + 20).minutes.ago]
    ).delete_all
  end
end
