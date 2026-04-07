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

  def recalculate!(start_date = Date.current, end_date = Date.current)
    cases_range = cases_by_date_of_birth_range(start_date, end_date)
    cases_range.find_in_batches(batch_size: 20) do |records|
      Child.transaction do
        Rails.logger.info "========================#{records.count}========================"
        update_records_batch(records)
      end
    end
  end

  def update_records_batch(records)
    records.each do |record|
      if update_age_for_case(record)
        Rails.logger.info "Case:[#{record.id}] Updating age to #{record.age}. Date of birth:[#{record.date_of_birth}]"
      else
        Rails.logger.warn(
          "Case:[#{record.id}] Not changed. Age remains at #{record.age}. Date of birth:[#{record.date_of_birth}]"
        )
      end
    end
  end

  def cases_by_date_of_birth_range(start_date, end_date)
    Child.where(
      "(data->>'date_of_birth')::date +
      ((DATE_PART('year', :start_date ::date) - DATE_PART('year', (data->>'date_of_birth')::date)) * interval '1 year')
      between :start_date::date and :end_date ::date
      or
      (data->>'date_of_birth')::date +
      ((DATE_PART('year', :end_date ::date) - DATE_PART('year', (data->>'date_of_birth')::date)) * interval '1 year')
      between :start_date ::date and :end_date ::date",
      start_date:, end_date:
    )
  end

  def update_age_for_case(record)
    return unless record.date_of_birth

    new_age = AgeService.age(record.date_of_birth)
    return unless new_age != record.age

    record.age = new_age
    record.save
  end
end
