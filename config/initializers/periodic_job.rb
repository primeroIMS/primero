# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Check or initialize Primero PeriodicJobs

return unless Rails.env.production?
return unless HealthCheckService.database_accessible? && ActiveRecord::Base.connection.table_exists?(:delayed_jobs)

Rails.logger.info('Setting up PeriodicJobs')

jobs = %w[ArchiveBulkExports RecalculateAge]
jobs << 'OptimizeSolr' if Rails.configuration.solr_enabled
jobs << 'SessionCleanup' unless Rails.configuration.x.idp.use_identity_provider

jobs.each do |job_name|
  next if Delayed::Job.where('handler LIKE :job_class', job_class: "%job_class: #{job_name}%").exists?

  Rails.logger.info("#{job_name} executed at #{DateTime.now}")
  job_name.constantize.perform_later
end
