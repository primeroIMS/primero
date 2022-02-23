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
    records = cases_by_date_of_birth_range(start_date, end_date)
    total_pages = records.results.total_pages
    Rails.logger.info "============================TOTAL CASES #{records.total}================================"
    (1..total_pages).each do |page|
      Rails.logger.info "=============================PAGE No: #{page}/#{total_pages}================================="
      cases_by_date_of_birth_range(start_date, end_date, page).results.each do |record|
        if update_age_for_case(record)
          Rails.logger.info "Case:[#{record.id}] Updating age to #{record.age}. Date of birth:[#{record.date_of_birth}]"
        else
          Rails.logger.warn "Case:[#{record.id}] Not changed. Age remains at #{record.age}. Date of birth:[#{record.date_of_birth}]"
        end
      end
    end
  end

  def cases_by_date_of_birth_range(start_date, end_date, page = 1)
    start_yday = AgeService.day_of_year(start_date)
    end_yday = AgeService.day_of_year(end_date)
    search = Child.search do
      with(:day_of_birth, start_yday..end_yday)
      order_by(:record_id, :desc)
      paginate({ page: page, per_page: 20 })
    end

    search_result = search.results

    Rails.logger.info "Cases to evaluate:[#{search_result.count}]"
    search
  end

  def update_age_for_case(record)
    return unless record.date_of_birth

    new_age = AgeService.age(record.date_of_birth)
    return unless new_age != record.age

    record.age = new_age
    record.save
  end
end
