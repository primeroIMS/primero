# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# PeriodicJob to clean up unverified users.
class CleanupUnverifiedUsers < PeriodicJob
  def self.reschedule_after
    1.day
  end

  def self.perform_job?
    Primero::Application.config.allow_self_registration && super
  end

  def perform_rescheduled
    Rails.logger.info 'Cleaning up unverified Users...'
    User.delete_unverified_older_than(fetch_retention_days)
  rescue StandardError
    Rails.logger.error 'Error Cleaning up unverified Users'
    raise
  end

  private

  def fetch_retention_days
    SystemSettings.current&.unverified_user_retention_days || 30
  end
end
