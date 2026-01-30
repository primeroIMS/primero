# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Check or initialize Primero PeriodicJobs

return unless Rails.env.production?

require "#{Rails.root}/app/services/health_check_service.rb"
require "#{Rails.root}/app/jobs/periodic_job.rb"
require "#{Rails.root}/app/schedules/archive_bulk_exports.rb"
require "#{Rails.root}/app/schedules/recalculate_age.rb"
require "#{Rails.root}/app/schedules/generate_unused_fields_report.rb"
require "#{Rails.root}/app/schedules/optimize_solr.rb" if Rails.configuration.solr_enabled
require "#{Rails.root}/app/schedules/session_cleanup.rb" unless Rails.configuration.x.idp.use_identity_provider

return unless HealthCheckService.database_accessible? && ActiveRecord::Base.connection.table_exists?(:delayed_jobs)

Rails.logger.info('Setting up PeriodicJobs')

jobs = %w[ArchiveBulkExports RecalculateAge GenerateUnusedFieldsReport]
jobs << 'OptimizeSolr' if Rails.configuration.solr_enabled
jobs << 'SessionCleanup' unless Rails.configuration.x.idp.use_identity_provider

jobs.each do |job_name|
  next if Delayed::Job.where('handler LIKE :job_class', job_class: "%job_class: #{job_name}%").exists?

  Rails.logger.info("#{job_name} executed at #{DateTime.now}")
  job_name.constantize.perform_later
end
