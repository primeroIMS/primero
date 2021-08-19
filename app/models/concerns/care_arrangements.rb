# frozen_string_literal: true

# Derived Care Arrangements Fields which use care arrangement fields defined on the subform
module CareArrangements
  extend ActiveSupport::Concern

  def current_care_arrangements_type
    most_recent_care_arrangement&.[]('care_arrangements_type')
  end

  def current_name_caregiver
    most_recent_care_arrangement&.[]('name_caregiver')
  end

  def current_care_arrangement_started_date
    most_recent_care_arrangement&.[]('care_arrangement_started_date')
  end

  def most_recent_care_arrangement
    return nil if care_arrangements_section.blank?

    care_arrangements_section
      .select { |care_arrangement| care_arrangement['care_arrangement_started_date'].present? }
      .max_by { |care_arrangement| care_arrangement['care_arrangement_started_date'] }
  end
end
