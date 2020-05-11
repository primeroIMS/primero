# frozen_string_literal: true

namespace :scheduler do
  desc 'Run scheduler in foreground'
  task run: :environment do
    require 'rufus/scheduler'
    scheduler = Rufus::Scheduler.new
    [
      CleansingTmpDir, ArchiveBulkExports,
      RecalculateAge,
      OptimizeSolr
    ].each { |job| job.schedule(scheduler) }
    scheduler.join
  end
end
