# frozen_string_literal: true

# This loads Rails environment and then starts the Scheduler
# This rake task can be used for local development purposes
# But the correct way to start this in production environments is script/scheduler-daemon.rb

namespace :scheduler do
  desc 'Run scheduler in foreground'
  task run: :environment do
    require 'rufus/scheduler'
    logger = Rails.logger = Logger.new(STDOUT, Rails.logger.level)
    if ENV['RAILS_SCHEDULER_LOG_DIR'].present?
      logger = Rails.logger = Logger.new(File.join(ENV['RAILS_SCHEDULER_LOG_DIR'], 'primero-scheduler.output'))
    end
    scheduler = Rufus::Scheduler.new

    [
      CleansingTmpDir, ArchiveBulkExports,
      RecalculateAge,
      OptimizeSolr
    ].each { |job| job.schedule(scheduler) }

    logger.info 'Rufus scheduler initialized'
    scheduler.join
  end
end
