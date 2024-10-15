# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

# Example of usage:
# rails r db/data_migration/v2.11/remove_solr_jobs.rb 2024-09-30
created_at_date_limit = ARGV[0].to_date.end_of_day

exit if Rails.application.config.solr_enabled

optimize_solr = Delayed::Job.where('handler LIKE :job_class', job_class: '%job_class: OptimizeSolr%')
old_bulkexport_job = Delayed::Job.where('handler LIKE :job_class',
                                        job_class: '%job_class: BulkExportJob%')
                                 .where(created_at: ..created_at_date_limit)

puts "Deleting OptimizeSolr #{optimize_solr.count}"
puts "Deleting BulkExportJob #{old_bulkexport_job.count}"

optimize_solr.delete_all
old_bulkexport_job.delete_all
