#TODO: This concern encapsulates monitoring/reporting business logic which is currently not being ported to Primero v2.
module IncidentMonitoringRecording
  extend ActiveSupport::Concern

  included do

    #before_save :set_violation_verification_default #TODO: Refactor with Violations
    #after_save :index_violations #TODO: Refactor with Violations
    #after_destroy :unindex_violations #TODO: Refactor with Violations
    #before_save :ensure_violation_categories_exist #TODO: Refactor with Violations

    searchable do
      #TODO: Refactor with Violations
      # string :violations, multiple: true do
      #   self.violation_type_list
      # end

      #TODO: Refactor with Violations
      # string :verification_status, multiple: true do
      #   self.violation_verified_list
      # end

      #TODO: Refactor with Violations
      # string :child_types, multiple: true do
      #   self.child_types
      # end

      #TODO: Refactor with Violations
      # string :armed_force_group_names, multiple: true do
      #   self.armed_force_group_names
      # end

      #TODO: Refactor with Violations
      # string :perpetrator_sub_categories, multiple: true do
      #   self.perpetrator_sub_categories
      # end
    end

  end

  module ClassMethods

    # Each violation type has a field that is used as part of the identification
    # of that violation
    # TODO: Refactor with Violations
    #TODO: This matches up to the collapsed fields on the violation subforms. NOT DRY!!!
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

    #TODO: Refactor with Violations
    #TODO: Refactor with Export
    #This method is overriding the one from the record concern to add in the violations property
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

  #TODO: Refactor with Violations
  def ensure_violation_categories_exist
    if self.violations.present?
      self.violations.to_hash.compact.each_key do |key|
        self.violation_category = [] if !self.violation_category.present?
        self.violation_category << key if !self.violation_category.include? key
      end
    end
  end

  #TODO: Refactor with Violations
  def violation_number_of_victims
    self.try(:incident_total_tally_total) || 0
  end

  #TODO: Refactor with Violations
  def violations_subforms
    subforms = []
    subforms = self.violations.to_hash.map{|key, value| value}.flatten if self.violations.present?
    subforms
  end

  #TODO: Refactor with Violations
  def violation_number_of_violations
    self.violations_subforms.size
  end

  #TODO: Refactor with Violations
  def violation_number_of_violations_verified
    number_of_violations_verified = 0
    self.violations_subforms.each do |subform|
      #TODO Do we need I18n for "Verified" string?
      number_of_violations_verified += 1 if subform.try(:verified) == "Verified"
    end
    number_of_violations_verified
  end

  # TODO: Refactor with Violations
  def violation_label(violation_type, violation, include_unique_id=false)
    id_fields = self.class.violation_id_fields
    label_id = violation.send(id_fields[violation_type].to_sym)
    label_id_text = (label_id.is_a?(Array) ? label_id.join(', ') : label_id)
    label = label_id.present? ? "#{violation_type.titleize} - #{label_id_text}" : "#{violation_type.titleize}"
    if include_unique_id
      label += " - #{violation['unique_id'].try(:slice, 0, 5)}"
    end
    label
  end

  # TODO: Refactor with Violations
  #TODO - Need rspec test for this
  def violations_list(compact_flag = false, include_unique_id=false)
    violations_list = []
    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each_with_index do |v, i|
          vlabel = violation_label(key, v, include_unique_id)
          # Add an index if compact_flag is false
          violations_list << vlabel
        end
      end
    end

    if compact_flag
      violations_list.uniq! if violations_list.present?
    else
      if violations_list.blank?
        violations_list << "NONE"
      end
    end

    return violations_list
  end

  # TODO: Refactor with Violations
  def violations_list_by_unique_id
    (self.violations || {}).to_hash.inject({}) do |acc, (vtype, vs)|
      acc.merge(vs.inject({}) do |acc2, v|
        acc2.merge({violation_label(vtype, v, true) => v['unique_id']})
      end)
    end
  end

  # TODO: Refactor with Violations
  #TODO - Need rspec test for this
  def violation_type_list
    violations_list = []
    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        if value.present?
          violations_list << key
        end
      end
    end

    return violations_list
  end

  # TODO: Refactor with Violations
  #TODO - Need rspec test for this
  def violation_verified_list
    violation_verified_list = []
    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each do |v|
          violation_verified_list << v.verified if v.verified.present?
        end
      end
    end
    violation_verified_list.uniq! if violation_verified_list.present?

    return violation_verified_list
  end

  def individual_ids
    ids = []
    if self.individual_details_subform_section.present?
      ids = self.individual_details_subform_section.map{|i| i['id_number']}.compact
    end
    return ids
  end

  # TODO: Refactor with Violations
  def set_violation_verification_default
    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each do |v|
          unless v.verified.present?
            v.verified = I18n.t('incident.violation.pending')
          end
        end
      end
    end
  end

  # TODO: Refactor with Violations
  def index_violations
    if self.violations.present?
      Sunspot.index! Violation.from_incident(self)
    end
  end

  # TODO: Refactor with Violations
  def unindex_violations
    if self.violations.present?
      Sunspot.remove! Violation.from_incident(self)
    end
  end

  #TODO: Refactor with Violations
  #TODO - Need rspec test for this
  def child_types
    child_type_list = []
    ['boys', 'girls', 'unknown'].each do |child_type|
      child_type_list << child_type if (self.send("incident_total_tally_#{child_type}".to_sym).present? && self.send("incident_total_tally_#{child_type}".to_sym) > 0)
    end
    child_type_list += self.violation_child_types
    child_type_list.uniq! if child_type_list.present?

    return child_type_list
  end

  #TODO: Refactor with Violations
  #Child types across all violations
  def violation_child_types
    child_type_list = []
    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each do |v|
          child_type_list += self.violation_children_list(key, v)
        end
      end
    end
    child_type_list.uniq! if child_type_list.present?

    return child_type_list
  end

  #TODO: Refactor with Violations
  #Child types on a single violation
  def violation_children_list(violation_type, violation)
    child_list = []
    ['boys', 'girls', 'unknown'].each do |child_type|
      child_count = 0
      #Special case for "attack on hospitals" and "attack on schools"
      if(violation_type == 'attack_on_hospitals' || violation_type == 'attack_on_schools')
        child_count += violation.send("violation_killed_tally_#{child_type}".to_sym) if violation.send("violation_killed_tally_#{child_type}".to_sym).is_a?(Fixnum)
        child_count += violation.send("violation_injured_tally_#{child_type}".to_sym) if violation.send("violation_injured_tally_#{child_type}".to_sym).is_a?(Fixnum)
      else
        child_count += violation.send("violation_tally_#{child_type}".to_sym) if violation.send("violation_tally_#{child_type}".to_sym).is_a?(Fixnum)
      end
      if child_count > 0
        child_list << child_type
      end
    end
    return child_list
  end

  #TODO: Refactor with Violations
  #TODO - Need rspec test for this
  def armed_force_group_names
    armed_force_groups = []
    if self.perpetrator_subform_section.present?
      self.perpetrator_subform_section.each {|p| armed_force_groups << p.armed_force_group_name if p.armed_force_group_name.present?}
    end
    armed_force_groups.uniq! if armed_force_groups.present?

    return armed_force_groups
  end

  #TODO: Refactor with Violations
  #TODO - Need rspec test for this
  def perpetrator_sub_categories
    categories = []
    if self.perpetrator_subform_section.present?
      self.perpetrator_subform_section.each {|p| categories << p.perpetrator_sub_category if p.perpetrator_sub_category.present?}
    end
    categories.uniq! if categories.present?

    return categories
  end

  #TODO: Refactor with Violations
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

  #TODO: Refactor with Violations
  def find_violation_by_unique_id unique_id
    each_violation.inject(nil) do |acc, (v, cat)|
      if v.unique_id == unique_id
        acc = [cat, v]
      end
      acc
    end
  end

end