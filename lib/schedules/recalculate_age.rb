module RecalculateAge

  class << self

    def schedule(scheduler)
      scheduler.cron '1 1 * * *' do # every night at 01:01 am
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
      Child.by_birthday_today.each do |c|
        old_age = c.age
        c.age = c.calculated_age
        if c.valid?
          c.save!
          Rails.logger.info "Case:[#{c.id}]  Age before:[#{old_age}  Age after:[#{c.age}]  Date of birth:[#{c.date_of_birth}]"
        else
          Rails.logger.info "Case:[#{c.id}] not updated... not valid"
        end
      end
    end
  end

end
