# frozen_string_literal: true

# This initializer gets executed early in the Rails boot sequence to check that
# the database is accepting connections or to wait 1 minute until it does.
Rails.application.config.before_initialize do
  break unless ENV['PRIMERO_WAIT_FOR_DB']

  max_attempts = 36
  wait_seconds = 5
  Rails.logger.info('Waiting for database to accept connections')
  attempts = 0
  until HealthCheckService.database_accessible?
    if attempts > max_attempts
      Rails.logger.fatal('Could not establish connection to the database. Halting!')
      ActiveRecord::Base.connection # Will throw exception
    end

    Rails.logger.info("Waiting for #{wait_seconds} seconds until testing the database connection again")
    sleep(wait_seconds)
    attempts += 1
  end
  Rails.logger.info("Proceeding with Rails bootstrap after making #{attempts} attempts to connect")
end
