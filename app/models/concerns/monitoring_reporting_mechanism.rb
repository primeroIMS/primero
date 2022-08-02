# frozen_string_literal: true

# MRM-related model
# rubocop:disable Metrics/ModuleLength
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  included do
    searchable do
      %i[
        individual_violations individual_sex victim_deprived_liberty_security_reasons
        reasons_deprivation_liberty victim_facilty_victims_held torture_punishment_while_deprivated_liberty
        violation_with_verification_status verification_status armed_force_group_party_names verified_ghn_reported
        violation_with_weapon_type violation_with_facility_impact violation_with_facility_attack_type
        child_role abduction_purpose_single military_use_type types_of_aid_disrupted_denial weapon_type facility_impact
        facility_attack_type late_verified_violations perpetrator_category
      ].each { |field| string(field, multiple: true) }

      integer(:individual_age, multiple: true)
      boolean(:has_late_verified_violations) { late_verified_violations? }
    end
  end

  def individual_violations
    individual_victims.map { |individual_victim| individual_victim.violations.map(&:type) }.flatten.uniq.compact
  end

  def individual_age
    individual_victims.map(&:individual_age).uniq.compact
  end

  def individual_sex
    individual_victims.map(&:individual_sex).uniq.compact
  end

  def victim_deprived_liberty_security_reasons
    individual_victims.map(&:victim_deprived_liberty_security_reasons).uniq.compact
  end

  def reasons_deprivation_liberty
    individual_victims.map(&:reasons_deprivation_liberty).uniq.compact
  end

  def victim_facilty_victims_held
    individual_victims.map(&:facilty_victims_held).uniq.compact
  end

  def torture_punishment_while_deprivated_liberty
    individual_victims.map(&:torture_punishment_while_deprivated_liberty).uniq.compact
  end

  def violation_with_verification_status
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.ctfmr_verified.present?

      memo << "#{violation.type}_#{violation.ctfmr_verified}"
    end.uniq
  end

  def late_verified_violations
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.is_late_verification

      memo << violation.type
    end.uniq
  end

  def late_verified_violations?
    violations.any?(&:is_late_verification)
  end

  def verification_status
    violations.map(&:ctfmr_verified).uniq.compact
  end

  def armed_force_group_party_names
    perpetrators.map(&:armed_force_group_party_name).uniq.compact
  end

  def perpetrator_category
    perpetrators.map(&:perpetrator_category).uniq.compact
  end

  def verified_ghn_reported
    violations.map(&:verified_ghn_reported).uniq.compact
  end

  def weapon_type
    violations.map(&:weapon_type).uniq.compact
  end

  def facility_impact
    violations.map(&:facility_impact).uniq.compact
  end

  def facility_attack_type
    violations.map(&:facility_attack_type).uniq.compact
  end

  def violation_with_weapon_type
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.weapon_type.present?

      memo << "#{violation.type}_#{violation.weapon_type}"
    end.uniq
  end

  def violation_with_facility_impact
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.facility_impact.present?

      memo << "#{violation.type}_#{violation.facility_impact}"
    end.uniq
  end

  def child_role
    violations.map(&:child_role).uniq.compact
  end

  def abduction_purpose_single
    violations.map(&:abduction_purpose_single).uniq.compact
  end

  def violation_with_facility_attack_type
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.facility_attack_type.present?

      violation.facility_attack_type.each do |attack_type|
        memo << "#{violation.type}_#{attack_type}"
      end
    end.uniq
  end

  def military_use_type
    violations.map(&:military_use_type).uniq.compact
  end

  def types_of_aid_disrupted_denial
    violations.map(&:types_of_aid_disrupted_denial).uniq.compact
  end
end
# rubocop:enable Metrics/ModuleLength
