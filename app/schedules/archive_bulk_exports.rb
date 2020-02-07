# frozen_string_literal: true

# Daily (1:21 UTC) job to clean up exports older than 30 days
class ArchiveBulkExports
  class << self
    def schedule(scheduler)
      scheduler.cron('21 1 * * *') do
        Rails.logger.info 'Archiving old exported files...'
        archive_old_exports
      rescue StandardError => e
        Rails.logger.error("Error archiving old exported files\n#{e.backtrace}")
      end
    end

    def archive_old_exports
      BulkExport.where.not(status: BulkExport::ARCHIVED)
                .where('completed_on <= ?', BulkExport.ARCHIVE_CUTOFF.days.ago)
                .find_in_batches(batch_size: 500) do |batch|
        batch.each(&:archive!)
      end
    end
  end
end