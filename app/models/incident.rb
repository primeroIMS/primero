class Incident < CouchRest::Model::Base
  use_database :incident

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward


  include Record
  include Ownable
  include Searchable #Needs to be after Ownable
  include Flaggable
  include DocumentHelper

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
                    emit(doc['description'], doc);
                  }
               }
            }"
  end

  before_save :set_violation_verification_default

  searchable do
    string :violations, multiple: true do
      violation_list = []
      if violations.present?
        violations.keys.each do |v|
          if violations[v].present?
            violation_list << v
          end
        end
      end
      violation_list
    end
  end

  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end

  def self.search_field
    "description"
  end

  def self.view_by_field_list
    ['created_at', 'description']
  end

  def create_class_specific_fields(fields)
    self['incident_id'] = self.incident_id
    self['description'] = fields['description'] || self.description || ''
  end

  def incident_id
    self['unique_identifier']
  end

  def incident_code
    (self.unique_identifier || "").last 7
  end

  def violations_list
    violations_list = []

    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each_with_index do |v, i|
          if v.violation_id.present?
            violations_list << v.violation_id
          else
            violations_list << "#{key.titleize} #{i}"
          end
        end
      end
    end

    if violations_list.blank?
      violations_list << "NONE"
    end

    return violations_list
  end

  #Copy some fields values from Survivor Information to GBV Individual Details.
  def copy_survivor_information(case_record)
    self.copy_fields(case_record, {
        "survivor_code_no" => "survivor_code",
        "age" => "age",
        "date_of_birth" => "date_of_birth",
        "gbv_sex" => "sex",
        "ethnicity" => "ethnicity",
        "country_of_origin" => "country_of_origin",
        "nationality" => "nationality",
        "religion"  => "religion",
        "maritial_status" => "maritial_status",
        "gbv_displacement_status" => "displacement_at_time_of_incident",
        "gbv_disability_type" => "disability_type",
        "unaccompanied_separated_status" => "unaccompanied_separated_status"
     })
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

end
