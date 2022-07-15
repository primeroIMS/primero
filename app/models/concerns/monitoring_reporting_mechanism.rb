# frozen_string_literal: true

# MRM-related model
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  included do
    searchable do
      %i[
        individual_violations individual_age individual_sex victim_deprived_liberty_security_reasons
        reasons_deprivation_liberty victim_facilty_victims_held torture_punishment_while_deprivated_liberty
        violation_with_verification_status verification_status armed_force_group_party_names verified_ghn_reported
        late_verified_violations
      ].each { |field| string(field, multiple: true) }

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

  def verified_ghn_reported
    violations.map(&:verified_ghn_reported).uniq.compact
  end
end
