# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for MRM Violation
class Violation < ApplicationRecord
  # TODO: There is some amount of duplication between this and the Incident container class. Refactor!

  TYPES = %w[killing maiming recruitment sexual_violence abduction attack_on_hospitals attack_on_schools military_use
             denial_humanitarian_access deprivation_liberty].freeze
  MRM_ASSOCIATIONS_KEYS = %w[sources perpetrators individual_victims group_victims responses].freeze

  has_and_belongs_to_many :individual_victims
  has_and_belongs_to_many :group_victims
  has_and_belongs_to_many :perpetrators
  has_and_belongs_to_many :sources
  has_many :responses, dependent: :destroy, inverse_of: :violation
  belongs_to :incident

  store_accessor :data,
                 :unique_id, :violation_tally, :verified, :type, :ctfmr_verified_date, :ctfmr_verified,
                 :verified_ghn_reported, :is_late_verification, :weapon_type, :facility_impact, :child_role,
                 :abduction_purpose_single, :facility_attack_type, :military_use_type, :types_of_aid_disrupted_denial,
                 :violation_killed_tally, :violation_injured_tally, :violation_tally

  after_initialize :set_unique_id

  before_save :calculate_late_verifications

  def set_unique_id
    self.unique_id = id
  end

  def associations_as_data
    @associations_as_data ||= {
      'sources' => sources.map(&:associations_as_data),
      'perpetrators' => perpetrators.map(&:associations_as_data),
      'individual_victims' => individual_victims.map(&:associations_as_data),
      'group_victims' => group_victims.map(&:associations_as_data),
      'responses' => responses.map(&:associations_as_data)
    }
  end

  def associations_as_data_keys
    MRM_ASSOCIATIONS_KEYS
  end

  def self.build_record(type, data, incident)
    violation = find_or_initialize_by(id: data['unique_id'])
    violation.incident = incident
    violation.data = RecordMergeDataHashService.merge_data(violation.data, data)
    violation.type = type
    violation
  end

  def associations_for_current_violation(associations_data)
    associations_data.select do |data|
      data['violations_ids'].include?(id)
    end
  end

  def calculate_late_verifications
    return unless ctfmr_verified == 'verified'

    self.is_late_verification = late_verification?
  end

  def late_verification_date_range?
    ctfmr_verified_date > (incident.incident_date_end || Date.today).end_of_quarter
  end

  def late_verification?
    return false unless ctfmr_verified_date.present? && incident.incident_date.present?

    return late_verification_date_range? if incident.is_incident_date_range

    ctfmr_verified_date > incident.incident_date.end_of_quarter
  end

  # TODO: Refactor on incident_monitoring_reporting concern
  def self.from_incident(_incident)
    []
  end

  def armed_force_group_names
    perpetrators.map(&:armed_force_group_name)
  end
end
