# frozen_string_literal: true

# Gender Based Violence records
module GenderBasedViolence
  extend ActiveSupport::Concern

  included do
    store_accessor(
      :data, :elapsed_reporting_time, :alleged_perpetrator, :number_of_perpetrators, :perpetrator_relationship,
      :perpetrator_age_group, :perpetrator_occupation
    )

    before_save :update_elapsed_reporting_time
    before_save :calculate_number_of_perpetrators
  end

  def update_elapsed_reporting_time
    self.elapsed_reporting_time = calculate_elapsed_reporting_time
  end

  def calculate_elapsed_reporting_time
    return unless incident_date.present? && date_of_first_report.present?

    elapsed_reporting_time_key((date_of_first_report - incident_date).to_i)
  end

  def elapsed_reporting_time_key(value)
    case value
    when 0..4 then '0_3_days'
    when 4..5 then '4_5_days'
    when 6..14 then '6_14_days'
    when 15..30 then '2_weeks_1_month'
    when 30.. then'over_1_month'
    end
  end

  def calculate_number_of_perpetrators
    if alleged_perpetrator.blank?
      self.number_of_perpetrators = nil
    else
      perpetrators_number = alleged_perpetrator.size
      self.number_of_perpetrators = perpetrators_number > 3 ? 'more_than_3' : "equal_to_#{perpetrators_number}"
    end
  end
end
