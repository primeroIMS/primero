class Incident < CouchRest::Model::Base
  use_database :incident

  MAX_DOCUMENTS = 10

  include PrimeroModel
  include RapidFTR::CouchRestRailsBackward


  include Record
  include Ownable
  include Flaggable
  include DocumentHelper

  property :incident_id
  property :description

  validate :validate_documents_size
  validate :validate_documents_count
  validate :validate_documents_file_type

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

  def validate_documents_size
    return true if @documents.blank? || @documents.all? {|document| document.size < 10.megabytes }
    errors.add(:document, I18n.t("errors.models.incident.document_size"))
    error_with_section(:upload_document, I18n.t("errors.models.incident.document_size"))
  end

  def validate_documents_count
    return true if @documents.blank? || self['document_keys'].size <= MAX_DOCUMENTS
    errors.add(:document, I18n.t("errors.models.incident.documents_count", :documents_count => MAX_DOCUMENTS))
    error_with_section(:upload_document, I18n.t("errors.models.incident.documents_count", :documents_count => MAX_DOCUMENTS))
  end

  def validate_documents_file_type
    return true if @documents.blank? || @documents.all? { |document| !document.original_filename.ends_with? ".exe" }
    errors.add(:document, "errors.models.incident.document_format")
    error_with_section(:upload_document, I18n.t("errors.models.incident.document_format"))
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
  def violation_id_fields
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
    id_fields = self.violation_id_fields
    label_id = violation.send(id_fields[violation_type].to_sym)
    label = label_id.present? ? "#{violation_type.titleize} - #{label_id}" : "#{violation_type.titleize}"
  end

  def violations_list(compact_flag = false)
    violations_list = []

    if self.violations.present?
      self.violations.to_hash.each do |key, value|
        value.each_with_index do |v, i|
          # Add an index if compact_flag is false
          compact_flag ? violations_list << "#{violation_label(key, v)}" : violations_list << "#{violation_label(key, v)} #{i}"
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

end
