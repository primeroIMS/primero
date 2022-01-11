# frozen_string_literal: true

# This concern encapsulates monitoring/reporting business logic
module IncidentMonitoringReporting
  extend ActiveSupport::Concern

  included do
    # before_save :set_violation_verification_default #TODO: Refactor with Violations
    # after_save :index_violations #TODO: Refactor with Violations
    # after_destroy :unindex_violations #TODO: Refactor with Violations
    # before_save :ensure_violation_categories_exist #TODO: Refactor with Violations

    searchable do
      # TODO: Refactor with Violations
      # string :violations, multiple: true do
      #   self.violation_type_list
      # end

      # TODO: Refactor with Violations
      # string :verification_status, multiple: true do
      #   self.violation_verified_list
      # end

      # TODO: Refactor with Violations
      # string :child_types, multiple: true do
      #   self.child_types
      # end

      # TODO: Refactor with Violations
      # string :armed_force_group_names, multiple: true do
      #   self.armed_force_group_names
      # end

      # TODO: Refactor with Violations
      # string :perpetrator_sub_categories, multiple: true do
      #   self.perpetrator_sub_categories
      # end
    end
  end

  # Define class methods
  module ClassMethods
    # Each violation type has a field that is used as part of the identification
    # of that violation
    # TODO: Refactor with Violations
    # TODO: This matches up to the collapsed fields on the violation subforms. NOT DRY!!!
    def violation_id_fields
      {
        'killing' => 'cause',
        'maiming' => 'cause',
        'recruitment' => 'factors_of_recruitment',
        'sexual_violence' => 'sexual_violence_type',
        'abduction' => 'abduction_purpose',
        'attack_on_schools' => 'site_attack_type',
        'attack_on_hospitals' => 'site_attack_type',
        'denial_humanitarian_access' => 'denial_method',
        'other_violation' => 'violation_other_type'
      }
    end

    # TODO: Refactor with Violations
    # TODO: Refactor with Export
    # This method is overriding the one from the record concern to add in the violations property
    # def get_properties_by_module(user, modules)
    #   props = super(user, modules)
    #   if props['primeromodule-mrm'].present?
    #     violations_property = Incident.properties.select{|p| p.name == 'violations'}.first
    #     if violations_property.present?
    #       violation_form_keys = Incident.violation_id_fields.keys
    #       violation_forms = modules.select{|m| m.id == "primeromodule-mrm"}.map do |m_mrm|
    #         m_mrm.associated_forms.select do |fs|
    #           fs.fields.any?{|f| (f.type == Field::SUBFORM) && violation_form_keys.include?(f.name)}
    #         end
    #       end.flatten.map{|f| f.name}
    #       props['primeromodule-mrm'].each do |form_name, form|
    #         if violation_forms.include? form_name
    #           props['primeromodule-mrm'][form_name] = {'violations' => violations_property}
    #         end
    #       end
    #     end
    #   end
    #   return props
    # end
  end

  # TODO: Refactor with Violations
  def ensure_violation_categories_exist
    return if violations.blank?

    violations.to_hash.compact.each_key do |key|
      self.violation_category = [] unless violation_category.present?
      violation_category << key unless violation_category.include? key
    end
  end

  # TODO: Refactor with Violations
  def violation_number_of_victims
    try(:incident_total_tally_total) || 0
  end

  # TODO: Refactor with Violations
  def violations_subforms
    subforms = []
    subforms = violations.to_hash.map { |_key, value| value }.flatten if violations.present?
    subforms
  end

  # TODO: Refactor with Violations
  def violation_number_of_violations
    violations_subforms.size
  end

  # TODO: Refactor with Violations
  def violation_number_of_violations_verified
    number_of_violations_verified = 0
    violations_subforms.each do |subform|
      # TODO: Do we need I18n for "Verified" string?
      number_of_violations_verified += 1 if subform.try(:verified) == 'Verified'
    end
    number_of_violations_verified
  end

  # TODO: Refactor with Violations
  def violation_label(violation_type, violation, include_unique_id = false)
    id_fields = self.class.violation_id_fields
    label_id = violation.send(id_fields[violation_type].to_sym)
    label_id_text = (label_id.is_a?(Array) ? label_id.join(', ') : label_id)
    label = label_id.present? ? "#{violation_type.titleize} - #{label_id_text}" : violation_type.titleize.to_s
    label += " - #{violation['unique_id'].try(:slice, 0, 5)}" if include_unique_id
    label
  end

  # TODO: Refactor with Violations
  # TODO - Need rspec test for this
  def violations_list(compact_flag = false, include_unique_id = false)
    violations_list = []
    add_violations_to_list(violations_list, include_unique_id) if violations.present?

    if compact_flag
      return violations_list.present? ? violations_list.uniq! : []
    end

    return ['NONE'] if violations_list.blank?

    violations_list
  end

  def add_violations_to_list(violations_list, include_unique_id)
    violations.to_hash.each do |key, value|
      value.each_with_index do |v, _i|
        vlabel = violation_label(key, v, include_unique_id)
        # Add an index if compact_flag is false
        violations_list << vlabel
      end
    end
  end

  # TODO: Refactor with Violations
  def violations_list_by_unique_id
    (violations || {}).to_hash.inject({}) do |acc, (vtype, vs)|
      acc.merge(vs.inject({}) do |acc2, v|
        acc2.merge({ violation_label(vtype, v, true) => v['unique_id'] })
      end)
    end
  end

  # TODO: Refactor with Violations
  # TODO - Need rspec test for this
  def violation_type_list
    violations_list = []
    if violations.present?
      violations.to_hash.each do |key, value|
        violations_list << key if value.present?
      end
    end

    violations_list
  end

  # TODO: Refactor with Violations
  # TODO - Need rspec test for this
  def violation_verified_list
    violation_verified_list = []
    if violations.present?
      violations.to_hash.each do |_key, value|
        value.each do |v|
          violation_verified_list << v.verified if v.verified.present?
        end
      end
    end
    violation_verified_list.uniq! if violation_verified_list.present?

    violation_verified_list
  end

  def individual_ids
    ids = []
    if individual_details_subform_section.present?
      ids = individual_details_subform_section.map { |i| i['id_number'] }.compact
    end
    ids
  end

  # TODO: Refactor with Violations
  def set_violation_verification_default
    return if violations.blank?

    violations.to_hash.each do |_key, value|
      value.each do |v|
        v.verified = I18n.t('incident.violation.pending') unless v.verified.present?
      end
    end
  end

  # TODO: Refactor with Violations
  def index_violations
    Sunspot.index! Violation.from_incident(self) if violations.present?
  end

  # TODO: Refactor with Violations
  def unindex_violations
    Sunspot.remove! Violation.from_incident(self) if violations.present?
  end

  # TODO: Refactor with Violations
  # TODO - Need rspec test for this
  def child_types
    child_type_list = []
    %w[boys girls unknown].each do |child_type|
      if send("incident_total_tally_#{child_type}".to_sym).present? &&
         send("incident_total_tally_#{child_type}".to_sym).positive?
        child_type_list << child_type
      end
    end
    child_type_list += violation_child_types
    child_type_list.uniq! if child_type_list.present?

    child_type_list
  end

  # TODO: Refactor with Violations
  # Child types across all violations
  def violation_child_types
    child_type_list = []
    if violations.present?
      violations.to_hash.each do |key, value|
        value.each do |v|
          child_type_list += violation_children_list(key, v)
        end
      end
    end
    child_type_list.uniq! if child_type_list.present?

    child_type_list
  end

  # TODO: Refactor with Violations
  # Child types on a single violation
  def violation_children_list(violation_type, violation)
    child_list = []
    %w[boys girls unknown].each do |child_type|
      child_list << child_type if calculate_child_count(violation_type, violation, child_type).positive?
    end
    child_list
  end

  def calculate_child_count(violation_type, violation, child_type)
    # Special case for "attack on hospitals" and "attack on schools"
    return count_school_or_hospital(violation, child_type) if school_or_hospital?(violation_type)

    child_count = violation.send("violation_tally_#{child_type}".to_sym)
    child_count.is_a?(Integer) ? child_count : 0
  end

  def school_or_hospital?(violation_type)
    %w[attack_on_hospitals attack_on_schools].include?(violation_type)
  end

  def count_school_or_hospital(violation, child_type)
    child_count = 0
    if violation.send("violation_killed_tally_#{child_type}".to_sym).is_a?(Integer)
      child_count += violation.send("violation_killed_tally_#{child_type}".to_sym)
    end
    if violation.send("violation_injured_tally_#{child_type}".to_sym).is_a?(Integer)
      child_count += violation.send("violation_injured_tally_#{child_type}".to_sym)
    end
    child_count
  end

  # TODO: Refactor with Violations
  # TODO - Need rspec test for this
  def armed_force_group_names
    armed_force_groups = []
    if perpetrator_subform_section.present?
      perpetrator_subform_section.each do |p|
        armed_force_groups << p.armed_force_group_name if p.armed_force_group_name.present?
      end
    end
    armed_force_groups.uniq! if armed_force_groups.present?

    armed_force_groups
  end

  # TODO: Refactor with Violations
  # TODO - Need rspec test for this
  def perpetrator_sub_categories
    categories = []
    if perpetrator_subform_section.present?
      perpetrator_subform_section.each do |p|
        categories << p.perpetrator_sub_category if p.perpetrator_sub_category.present?
      end
    end
    categories.uniq! if categories.present?

    categories
  end

  # TODO: Refactor with Violations
  # TODO: Combine/refactor this violations iterator to spit out instances of
  # TODO: Pavel's new Violation model
  def each_violation
    return enum_for(:each_violation) unless block_given?

    violations.keys.each do |cat|
      (violations[cat] || []).each do |v|
        yield v, cat
      end
    end
  end

  # TODO: Refactor with Violations
  def find_violation_by_unique_id(unique_id)
    each_violation.inject(nil) do |acc, (v, cat)|
      acc = [cat, v] if v.unique_id == unique_id
      acc
    end
  end
end
