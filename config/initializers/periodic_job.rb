# frozen_string_literal: true

# Check or initialize Primero PeriodicJobs
Rails.logger.info('Setting up PeriodicJobs')

%w[ArchiveBulkExports OptimizeSolr RecalculateAge].each do |job_name|
  next unless Rails.env.production? && !PeriodicJob.descendants.map(&:to_s).include?(job_name)

  Rails.logger.info("#{job_name} executed at #{DateTime.now}")
  job_name.constantize.perform_later
end
