# frozen_string_literal: true

# Check or initialize Primero PeriodicJobs

return unless Rails.env.production?

Rails.logger.info('Setting up PeriodicJobs')

%w[ArchiveBulkExports OptimizeSolr RecalculateAge].each do |job_name|
  next if Delayed::Job.where("handler LIKE :job_class", job_class: "%job_class: #{job_name}%").exists?

  Rails.logger.info("#{job_name} executed at #{DateTime.now}")
  job_name.constantize.perform_later
end
