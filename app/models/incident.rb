class Incident < CouchRest::Model::Base
  use_database :incident

  include PrimeroModel
  include RapidFTR::CouchRestRailsBackward

  include Record
  include Ownable
  include Flaggable
  include DocumentUploader

  property :incident_id
  property :description

  def initialize *args
    self['histories'] = []

    super *args
  end

  design do
    view :by_incident_id
    view :by_description,
            :map => "function(doc) {
                if (doc['couchrest-type'] == 'Incident')
               {
                  if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                    emit(doc['description'], null);
                  }
               }
            }"
  end

  before_save :set_violation_verification_default

  def self.quicksearch_fields
    [
      'incident_id', 'incident_code', 'super_incident_name', 'incident_description',
      'monitor_number', 'survivor_code',
      'individual_ids'
    ]
  end
  include Searchable #Needs to be after Ownable

  searchable do
    string :violations, multiple: true do
      self.violation_type_list
    end

    string :verification_status, multiple: true do
      self.violation_verified_list
    end

    string :child_types, multiple: true do
      self.child_types
    end

    string :armed_force_group_names, multiple: true do
      self.armed_force_group_names
    end

    string :perpetrator_sub_categories, multiple: true do
      self.perpetrator_sub_categories
    end

    date :incident_date_derived do
      self.incident_date_derived
    end

  end

  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end

  #TODO: Keep this?
  def self.search_field
    "description"
  end

  def self.view_by_field_list
    ['created_at', 'description']
  end

  def set_instance_id
    self.incident_id ||= self.unique_identifier
  end

  def create_class_specific_fields(fields)
    self['description'] = fields['description'] || self.description || ''
  end

  def incident_code
    (self.unique_identifier || "").last 7
  end

  # Each violation type has a field that is used as part of the identification
  # of that violation
  def self.violation_id_fields
    {
      'killing' => 'kill_cause_of_death',
      'maiming' => 'maim_cause_of',
      'recruitment' => 'factors_of_recruitment',
      'sexual_violence' => 'sexual_violence_type',
      'abduction' => 'abduction_purpose',
      'attack_on_schools' => 'site_attack_type',
      'attack_on_hospitals' => 'site_attack_type_hospital',
      'denial_humanitarian_access' => 'denial_method',
      'other_violation' => 'violation_other_type'
    }
  end

  def violation_label(violation_type, violation)
    id_fields = self.class.violation_id_fields
    label_id = violation.send(id_fields[violation_type].to_sym)
    label_id_text = (label_id.is_a?(Array) ? label_id.join(', ') : label_id)
    label = label_id.present? ? "#{violation_type.titleize} - #{label_id_text}" : "#{violation_type.titleize}"
  end

  #TODO - Need rspec test for this
  def violations_list(compact_flag = false)
    violations_list = []
    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each_with_index do |v, i|
          # Add an index if compact_flag is false
          violations_list << (compact_flag ? "#{violation_label(key, v)}" : "#{violation_label(key, v)} #{i}")
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

  #Copy some fields values from Survivor Information to GBV Individual Details.
  def copy_survivor_information(case_record)
    copy_fields(case_record, {
        "survivor_code_no" => "survivor_code",
        "age" => "age",
        "date_of_birth" => "date_of_birth",
        "gbv_sex" => "sex",
        "gbv_ethnicity" => "ethnicity",
        "country_of_origin" => "country_of_origin",
        "gbv_nationality" => "nationality",
        "gbv_religion"  => "religion",
        "maritial_status" => "maritial_status",
        "gbv_displacement_status" => "displacement_status",
        "gbv_disability_type" => "disability_type",
        "unaccompanied_separated_status" => "unaccompanied_separated_status"
     })
  end

  def individual_ids
    ids = []
    if self.individual_details_subform_section.present?
      ids = self.individual_details_subform_section.map(&:id_number).compact
    end
    return ids
  end

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

  #Child types on a single violation
  def violation_children_list(violation_type, violation)
    child_list = []
    ['boys', 'girls', 'unknown'].each do |child_type|
      child_count = 0
      #Special case for "attack on hospitals" and "attack on schools"
      if(violation_type == 'attack_on_hospitals' || violation_type == 'attack_on_schools')
        child_count += violation.send("violation_killed_tally_#{child_type}".to_sym) if violation.send("violation_killed_tally_#{child_type}".to_sym).present?
        child_count += violation.send("violation_injured_tally_#{child_type}".to_sym) if violation.send("violation_injured_tally_#{child_type}".to_sym).present?
      else
        child_count += violation.send("violation_tally_#{child_type}".to_sym) if violation.send("violation_tally_#{child_type}".to_sym).present?
      end
      if child_count > 0
        child_list << child_type
      end
    end
    return child_list
  end

  #TODO - Need rspec test for this
  def armed_force_group_names
    armed_force_groups = []
    if self.perpetrator_subform_section.present?
      self.perpetrator_subform_section.each {|p| armed_force_groups << p.armed_force_group_name if p.armed_force_group_name.present?}
    end
    armed_force_groups.uniq! if armed_force_groups.present?

    return armed_force_groups
  end

  #TODO - Need rspec test for this
  def perpetrator_sub_categories
    categories = []
    if self.perpetrator_subform_section.present?
      self.perpetrator_subform_section.each {|p| categories << p.perpetrator_sub_category if p.perpetrator_sub_category.present?}
    end
    categories.uniq! if categories.present?

    return categories
  end

  #TODO - Need rspec test for this
  def incident_date_derived
    return self.incident_date if self.incident_date.present?
    return self.date_of_incident_from if self.date_of_incident_from.present?
    return self.date_of_incident if self.date_of_incident.present?
    return nil
  end
end
