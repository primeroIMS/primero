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
    ASSOCIATION_FIELDS.each do |(association_field_name, field_names)|
      associated_values = calculate_association_values(association_field_name, field_names)

      associated_values.each do |(field_name, values)|
        field = ASSOCIATION_MAPPING[field_name] || field_name
        data[field] = values
      end
    end
  end

  def stamp_fields_with_violation_type
    field_names = VIOLATION_TYPED_FIELDS.values
    values_with_violation_type = calculate_association_values('violations', field_names) do |association, field_name|
      association_typed_field_value(association, field_name)
    end

    values_with_violation_type.each do |(field_name, values)|
      field = VIOLATION_TYPED_FIELDS.key(field_name)
      data[field] = values
    end
  end

  def calculate_association_values(association_field_name, field_names)
    send(association_field_name).each_with_object({}) do |association, memo|
      field_names.each do |field_name|
        memo[field_name] = [] unless memo[field_name].present?
        value = block_given? ? yield(association, field_name) : association.send(field_name)
        next unless value.present?

        add_associated_value(memo, field_name, value)
      end
    end
  end

  def add_associated_value(memo, field_name, value)
    if value.is_a?(Array)
      value.each { |elem| memo[field_name] << elem if memo[field_name].exclude?(elem) }
    elsif memo[field_name].exclude?(value)
      memo[field_name] << value
    end
  end

  def association_typed_field_value(association, field_name)
    return unless association.type.present?

    field_value = association.send(field_name)
    return "#{association.type}_#{field_value}" unless field_value.is_a?(Array)

    field_value.map { |elem| "#{association.type}_#{elem}" }
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

      violation.facility_attack_type.each { |attack_type| memo << "#{violation.type}_#{attack_type}" }
    end.uniq

    violation_with_facility_attack_type
  end
end
# rubocop:enable Metrics/ModuleLength
