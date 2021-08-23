# frozen_string_literal: true

logfile = if ENV['RAILS_LOG_PATH'].present? && ENV['LOG_TO_STDOUT'].blank?
            "#{ENV['RAILS_LOG_PATH']}/backburner.log"
          else
            STDOUT
          end

Delayed::Worker.destroy_failed_jobs = false
Delayed::Worker.sleep_delay = 5
Delayed::Worker.max_attempts = 3
Delayed::Worker.max_run_time = 2.hours
Delayed::Worker.read_ahead = 10
Delayed::Worker.default_queue_name = 'api'
Delayed::Worker.delay_jobs = !Rails.env.test?
Delayed::Worker.raise_signal_exceptions = :term
Delayed::Worker.logger = Logger.new(logfile, 5, 50.megabytes).tap { |l| l.level = Logger::INFO }
