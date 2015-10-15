module RecalculateAge

  class << self

    def schedule(scheduler)
      scheduler.cron '1 1 * * *' do # every night at 01:01 am
        begin
          # It is necessary to use a date range here so we don't miss out on cases with leap year birthdays (2/29)
          # on non leap years
          recalculate! Date.yesterday, Date.current
        rescue => e
          Rails.logger.error "Error recalculating ages based on date of birth"
          e.backtrace.each { |line| Rails.logger.error line }
        end
      end
    end

    def recalculate!(startDate = nil, endDate = nil)
      Rails.logger.info "Recalculating ages based on date of birth. startDate:[#{startDate}]  endDate:[#{endDate}]"
      cases = (startDate.present? && endDate.present? && (startDate <= endDate)) ?
                Child.by_date_of_birth_range(startDate, endDate) : Child.by_date_of_birth
      cases.each do |c|
        old_age = c.age
        c.age = c.calculated_age
        if c.valid?
          if c.changed?
            c.save!
            Rails.logger.info "Case:[#{c.id}] UPDATED. Age before:[#{old_age}]  Age after:[#{c.age}]  Date of birth:[#{c.date_of_birth}]"
          else
            Rails.logger.info "Case:[#{c.id}] Not changed, no need to update. Age:[#{c.age}]  Date of birth:[#{c.date_of_birth}]"
          end
        else
          Rails.logger.info "Case:[#{c.id}] not updated... not valid"
        end
      end
      Rails.logger.info "Recalculating ages complete."
    end
  end

end
