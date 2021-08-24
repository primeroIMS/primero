# frozen_string_literal: true

# PeriodicJob to recalculate the age of case records.
class RecalculateAge < PeriodicJob
  def perform_rescheduled
    start_date = Date.yesterday
    end_date = Date.current
    Rails.logger.info "Recalculating ages based on date of birth. startDate:[#{start_date}]  endDate:[#{end_date}]"
    RecalculateAge.new.recalculate!(start_date, end_date)
    Rails.logger.info 'Recalculating ages complete.'
  end

  def self.reschedule_after
    1.day
  end

  def self.recalculate!
    new.recalculate!
  end

  def recalculate!(start_date = Date.yesterday, end_date = Date.current)
    cases_by_date_of_birth_range(start_date, end_date).each do |c|
      if update_age_for_case(c)
        Rails.logger.info "Case:[#{c.id}] Updating age to #{c.age}. Date of birth:[#{c.date_of_birth}]"
      else
        Rails.logger.warn "Case:[#{c.id}] Not changed. Age remains at #{c.age}. Date of birth:[#{c.date_of_birth}]"
      end
    end
  end

  def cases_by_date_of_birth_range(start_date, end_date)
    start_yday = AgeService.day_of_year(start_date)
    end_yday = AgeService.day_of_year(end_date)
    search_result = Child.search do
      with(:day_of_birth, start_yday..end_yday)
    end.results

    Rails.logger.info "Cases to evaluate:[#{search_result.count}]"
    search_result
  end

  def update_age_for_case(record)
    return unless record.date_of_birth

    new_age = AgeService.age(record.date_of_birth)
    return unless new_age != record.age

    record.age = new_age
    record.save
  end
end
