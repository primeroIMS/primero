# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# MRM-related model
# rubocop:disable Metrics/ModuleLength
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  ASSOCIATION_MAPPING = {
    'armed_force_group_party_name' => 'armed_force_group_party_names',
    'ctfmr_verified' => 'verification_status',
    'facilty_victims_held' => 'victim_facilty_victims_held'
  }.freeze

  ASSOCIATION_FIELDS = {
    'individual_victims' => %w[
      individual_age individual_sex victim_deprived_liberty_security_reasons reasons_deprivation_liberty
      facilty_victims_held torture_punishment_while_deprivated_liberty
    ],
    'perpetrators' => %w[armed_force_group_party_name perpetrator_category],
    'violations' => %w[
      verified_ghn_reported weapon_type facility_impact facility_attack_type child_role abduction_purpose_single
      military_use_type types_of_aid_disrupted_denial ctfmr_verified_date ctfmr_verified
    ]
  }.freeze

  VIOLATION_TYPED_FIELDS = {
    'violation_with_verification_status' => 'ctfmr_verified',
    'violation_with_weapon_type' => 'weapon_type',
    'violation_with_facility_impact' => 'facility_impact'
  }.freeze

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
      date(:ctfmr_verified_date, multiple: true)
      boolean(:has_late_verified_violations) { late_verified_violations? }
    end

    # TODO: For now we are storing the associations fields in the incident data, but at some point we should be able
    # to extend our filters in order to query the association directly.
    store_accessor(
      :data, :individual_violations, :individual_age, :individual_sex, :victim_deprived_liberty_security_reasons,
      :reasons_deprivation_liberty, :victim_facilty_victims_held, :torture_punishment_while_deprivated_liberty,
      :violation_with_verification_status, :late_verified_violations, :has_late_verified_violations,
      :verification_status, :armed_force_group_party_names, :perpetrator_category, :verified_ghn_reported,
      :weapon_type, :facility_impact, :facility_attack_type, :violation_with_weapon_type, :child_role,
      :abduction_purpose_single, :violation_with_facility_impact, :violation_with_facility_attack_type,
      :military_use_type, :types_of_aid_disrupted_denial, :ctfmr_verified_date
    )
  end

  def recalculate_association_fields
    stamp_association_fields
    stamp_fields_with_violation_type
    calculate_individual_violations
    calculate_late_verified_violations
    calculate_has_late_verified_violations
    calculate_violation_with_facility_attack_type
  end

  def stamp_association_fields
    ASSOCIATION_FIELDS.each do |(association, field_names)|
      send(association).each do |elem|
        field_names.each { |field_name| add_association_value(field_name, elem.send(field_name)) }
      end
    end
  end

  def stamp_fields_with_violation_type
    violations.each do |violation|
      next unless violation.type.present?

      VIOLATION_TYPED_FIELDS.each do |(field_name, violation_field_name)|
        add_association_value(field_name, violation.send(violation_field_name), violation.type)
      end
    end
  end

  def add_association_value(field_name, value, type = nil)
    return unless value.present?

    field = ASSOCIATION_MAPPING[field_name] || field_name
    data[field] = [] unless data[field].present?
    field_value = type.present? ? "#{type}_#{value}" : value
    add_field_value(field, field_value)
  end

  def add_field_value(field, value)
    if value.is_a?(Array)
      value.each { |elem| data[field] << elem if data[field].exclude?(elem) }
    elsif data[field].exclude?(value)
      data[field] << value
    end
  end

  def calculate_individual_violations
    self.individual_violations = individual_victims.map do |individual_victim|
      individual_victim.violations.map(&:type)
    end.flatten.uniq.compact

    individual_violations
  end

  def calculate_late_verified_violations
    self.late_verified_violations = violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.is_late_verification

      memo << violation.type
    end.uniq

    late_verified_violations
  end

  def calculate_has_late_verified_violations
    self.has_late_verified_violations = violations.any?(&:is_late_verification)

    has_late_verified_violations
  end

  def late_verified_violations?
    has_late_verified_violations
  end

  def calculate_violation_with_facility_attack_type
    self.violation_with_facility_attack_type = violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.facility_attack_type.present?

      violation.facility_attack_type.each do |attack_type|
        memo << "#{violation.type}_#{attack_type}"
      end
    end.uniq

    violation_with_facility_attack_type
  end
end
# rubocop:enable Metrics/ModuleLength
