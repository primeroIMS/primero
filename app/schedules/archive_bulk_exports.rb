module ArchiveBulkExports

  class << self

    #Call daily at 1:21 UTC
    def schedule(scheduler)
      scheduler.cron('21 1 * * *') do
        begin
          Rails.logger.info "Archiving old exported files..."
          archive_old_exports
        rescue => e
          Rails.logger.error "Error archiving old exported files"
          e.backtrace.each { |line| Rails.logger.error line }
        end
      end
    end

    def archive_old_exports
      pagination_ops = {:page => 1, :per_page => 500}
      bulk_exports = []
      begin
        results = BulkExport.search{with(:completed_on).before(BulkExport.ARCHIVE_CUTOFF)}.results
        bulk_exports.concat(results)
        pagination_ops[:page] = results.next_page
        pagination_ops[:per_page] = 500
      end until results.next_page.nil?
      bulk_exports.each &:archive!
    end

  end

end