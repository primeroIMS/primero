# frozen_string_literal: true

# PeriodicJob job to clean up exports older than 30 days
class ArchiveBulkExports < PeriodicJob
  def perform_rescheduled
    Rails.logger.info 'Archiving old exported files...'
    new.archive_old_exports
  rescue StandardError => e
    Rails.logger.error("Error archiving old exported files\n#{e.backtrace}")
  end

  def self.reschedule_after
    1.day
  end

  def archive_old_exports
    BulkExport.where.not(status: BulkExport::ARCHIVED)
              .where('completed_on <= ?', BulkExport.ARCHIVE_CUTOFF.days.ago)
              .find_in_batches(batch_size: 500) do |batch|
      batch.each(&:archive!)
    end
  end

  def self.perform_job?
    # Loading service configurations
    # activestorage/lib/active_storage/engine.rb
    # initializer "active_storage.services"
    ActiveStorage::Blob.service
    current_service = Rails.application.config.active_storage.service.to_s
    Rails.configuration.active_storage.service_configurations.dig(current_service, 'service') == 'Disk'
  end
end
