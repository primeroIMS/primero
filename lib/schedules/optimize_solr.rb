module OptimizeSolr
  class << self
    def schedule(scheduler)
      scheduler.cron('1 2 * * *') do
        begin
          Rails.logger.info "Optimizing Solr..."
          optimize
        rescue => e
          Rails.logger.error "Error optimizing Solr"
          e.backtrace.each { |line| Rails.logger.error line }
        end
      end
    end

    def optimize
      Sunspot.optimize
    end
  end
end