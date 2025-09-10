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
      :military_use_type, :types_of_aid_disrupted_denial, :ctfmr_verified_date, :incident_total_tally, :child_types
    )

    has_many :violations, dependent: :destroy, inverse_of: :incident
    has_many :perpetrators, through: :violations
    has_many :individual_victims, through: :violations
    has_many :sources, through: :violations

    before_save :save_violations_and_associations
    before_save :update_violations
    before_save :recalculate_child_types
  end

  # Class methods for all MRM Incidents
  module ClassMethods
    def violations_data(data_keys, data)
      return {} unless data

      data_keys.reduce({}) do |acc, elem|
        next acc unless data[elem].present?

        acc.merge(elem => data.delete(elem))
      end
    end
  end

  def build_or_update_violations_and_associations(data)
    return unless mrm?

    build_or_update_violations(self.class.violations_data(Violation::TYPES, data))
    build_violations_associations(self.class.violations_data(Violation::MRM_ASSOCIATIONS_KEYS, data))
  end

  def build_or_update_violations(violation_objects_data)
    return unless violation_objects_data.present?

    @violations_to_save = violation_objects_data.each_with_object([]) do |(type, violations_by_type), acc|
      violations_by_type.each { |violation_data| acc << Violation.build_record(type, violation_data, self) }
      acc
    end
  end

  def build_violations_associations(violation_associations_data)
    return unless violation_associations_data.present?

    @associations_to_save = violation_associations_data.each_with_object([]) do |(type, associations_data), acc|
      association_object = type.classify.constantize
      associations_data.each { |association_data| acc << association_object.build_record(association_data) }
      acc
    end
  end

  def mrm?
    module_id == PrimeroModule::MRM
  end

  def save_violations_and_associations
    save_violations
    save_violations_associations

    return unless @violations_to_save.present? || @associations_to_save.present?

    reload_violations_and_associations
    recalculate_association_fields
  end

  def save_violations
    return unless @violations_to_save

    @violations_to_save.each(&:save!)
  end

  def save_violations_associations
    return unless @associations_to_save

    @associations_to_save.each do |association|
      if association.violations_ids.present?
        association.violations = violations_for_associated(association.violations_ids)
      end
      next if association.violations.blank?

      association.save!
    end
  end

  def association_classes_to_save
    return unless @associations_to_save

    @associations_to_save.map(&:class).uniq.compact
  end

  def associations_as_data(_current_user)
    mrm_associations = associations_as_data_keys.to_h { |value| [value, []] }

    @associations_as_data ||= violations.reduce(mrm_associations) do |acc, violation|
      acc[violation.type] << violation.data
      acc.merge(violation.associations_as_data) do |_key, acc_value, violation_value|
        (acc_value + violation_value).compact.uniq { |value| value['unique_id'] }
      end
    end
  end

  def associations_as_data_keys
    (Violation::TYPES + Violation::MRM_ASSOCIATIONS_KEYS)
  end

  # Returns a list of Violations to be associated with
  # Violation::MRM_ASSOCIATIONS_KEYS (perpetrators, victims...) on API update
  def violations_for_associated(violations_ids)
    ids = (violations_ids.is_a?(Array) ? violations_ids : [violations_ids])
    violations_result = []

    if @violations_to_save.present?
      violations_result += @violations_to_save.select { |violation| ids.include?(violation.id) }
    end
    violations_result += Violation.where(id: ids - violations_result.map(&:id))

    violations_result
  end

  def update_violations
    should_update_violations = !new_record? && mrm? && (incident_date_changed? || incident_date_end_changed?)

    return unless should_update_violations

    violations.each(&:calculate_late_verifications)
  end

  # TODO: This method will trigger queries to reload the violations and associations in order to store the latest data
  def reload_violations_and_associations
    association_classes = association_classes_to_save
    violations.reload if @violations_to_save.present? || association_classes.include?(Source)
    return unless association_classes.present?

    individual_victims.reload if association_classes.include?(IndividualVictim)
    perpetrators.reload if association_classes.include?(Perpetrator)
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
      extract_values_from_associations(send(association), field_names).each do |(field_name, values)|
        field = ASSOCIATION_MAPPING[field_name] || field_name
        data[field] = values
      end
    end
  end

  def stamp_fields_with_violation_type
    extract_values_with_type_from_violations(violations, VIOLATION_TYPED_FIELDS.values).each do |(field_name, values)|
      field = VIOLATION_TYPED_FIELDS.key(field_name)
      data[field] = values
    end
  end

  def extract_values_from_associations(associations_to_stamp, field_names)
    associations_to_stamp.each_with_object({}) do |association, memo|
      field_names&.each do |field_name|
        memo[field_name] = [] unless memo[field_name].present?
        value = association.send(field_name)
        next unless value.present?

        memo[field_name] += Array.wrap(value).reject { |elem| memo[field_name].include?(elem) }
      end
    end
  end

  def extract_values_with_type_from_violations(violations_to_stamp, field_names)
    violations_to_stamp.each_with_object({}) do |violation, memo|
      next unless violation.type.present?

      field_names.each do |field_name|
        memo[field_name] = [] unless memo[field_name].present?
        value = extract_value_from_violation(violation, field_name)
        next unless value.present?

        memo[field_name] += value.reject { |elem| memo[field_name].include?(elem) }
      end
    end
  end

  def extract_value_from_violation(violation, field_name)
    Array.wrap(violation.send(field_name)).map { |elem| "#{violation.type}_#{elem}" }
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

  def recalculate_child_types
    self.child_types = record_child_types | violations_child_types

    child_types
  end

  def record_child_types
    child_types_for_tally(incident_total_tally)
  end

  def violations_child_types
    violations.reduce([]) do |violations_memo, violation|
      tally_values = [violation.violation_killed_tally, violation.violation_injured_tally, violation.violation_tally]
      tally_child_types = tally_values.reduce([]) { |tally_memo, tally| tally_memo | child_types_for_tally(tally) }
      violations_memo | tally_child_types
    end
  end

  def child_types_for_tally(tally)
    return [] unless tally.present?

    tally.select { |key, value| key != 'total' && value&.positive? }.keys
  end
end
# rubocop:enable Metrics/ModuleLength
