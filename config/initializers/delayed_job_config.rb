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
Delayed::Worker.default_queue_name = 'default'
Delayed::Worker.delay_jobs = !Rails.env.test?
Delayed::Worker.raise_signal_exceptions = :term
# Priority 5 because we have 5 queues. When a queue with higher priority has pending jobs,
# that queue will be emptied first. This means that AuditLog jobs could take a while
# to run if other jobs are running.
Delayed::Worker.queue_attributes = { logger: { priority: 6 } }
Delayed::Worker.logger = Logger.new(logfile, 5, 50.megabytes).tap { |l| l.level = Logger::INFO }
