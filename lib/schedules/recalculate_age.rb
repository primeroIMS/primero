module RecalculateAge

  class << self

    def schedule(scheduler)
      scheduler.every("15s") do
        begin
          Rails.logger.info "Recalculating ages based on date of birth..."
          recalculate!
        rescue => e
          Rails.logger.error "Error recalculating ages based on date of birth"
          e.backtrace.each { |line| Rails.logger.error line }
        end
      end
    end

    def recalculate!
      #TODO - do stuff here :)
      puts 'Test message for recalculate age...'
    end
    
  end

end
