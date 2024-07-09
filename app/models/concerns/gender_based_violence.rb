# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Gender Based Violence records
module GenderBasedViolence
  extend ActiveSupport::Concern

  RAPE = 'rape'
  NON_GBV = 'non-gbv'
  SEXUAL_ASSAULT = 'sexual_assault'
  FORCED_MARRIAGE = 'forced_marriage'
  INTIMATE_PARTNER_FORMER_PARTNER = 'intimate_partner_former_partner'
  NONE = 'none'
  INTIMATE_PARTNER_VIOLENCE = 'intimate_partner_violence'
  CHILD_SEXUAL_ABUSE = 'child_sexual_abuse'
  EARLY_MARRIAGE = 'early_marriage'
  POSSIBLE_SEXUAL_EXPLOITATION = 'possible_sexual_exploitation'
  POSSIBLE_SEXUAL_SLAVERY = 'possible_sexual_slavery'
  HARMFUL_TRADITIONAL_PRACTICE = 'harmful_traditional_practice'

  included do
    store_accessor(
      :data, :gbv_sexual_violence_type, :elapsed_reporting_time, :alleged_perpetrator, :number_of_perpetrators,
      :age, :harmful_traditional_practice, :goods_money_exchanged, :abduction_status_time_of_incident, :gbv_case_context
    )

    before_save :update_elapsed_reporting_time
    before_save :calculate_number_of_perpetrators
    before_save :calculate_gbv_case_context
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

  def calculate_gbv_case_context
    self.gbv_case_context = [
      INTIMATE_PARTNER_VIOLENCE,
      CHILD_SEXUAL_ABUSE,
      EARLY_MARRIAGE,
      POSSIBLE_SEXUAL_EXPLOITATION,
      POSSIBLE_SEXUAL_SLAVERY,
      HARMFUL_TRADITIONAL_PRACTICE
    ].select { |context| send("#{context}?") }
  end

  def intimate_partner_violence?
    gbv_sexual_violence? && intimate_partner?
  end

  def child_sexual_abuse?
    [RAPE, SEXUAL_ASSAULT].include?(gbv_sexual_violence_type) && under_18?
  end

  def early_marriage?
    gbv_sexual_violence_type == FORCED_MARRIAGE && under_18?
  end

  def possible_sexual_exploitation?
    [RAPE, SEXUAL_ASSAULT].include?(gbv_sexual_violence_type) && goods_money_exchanged.present?
  end

  def possible_sexual_slavery?
    [RAPE, SEXUAL_ASSAULT].include?(gbv_sexual_violence_type) &&
      abduction_status_time_of_incident.present? && abduction_status_time_of_incident != NONE
  end

  def harmful_traditional_practice?
    gbv_sexual_violence? && harmful_traditional_practice.present?
  end

  def under_18?
    return false unless age.present?

    age < 18
  end

  def intimate_partner?
    alleged_perpetrator&.any? do |perpetrator|
      perpetrator['perpetrator_relationship'] == INTIMATE_PARTNER_FORMER_PARTNER
    end
  end

  def gbv_sexual_violence?
    gbv_sexual_violence_type.present? && gbv_sexual_violence_type != NON_GBV
  end
end
