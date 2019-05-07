class Incident < ApplicationRecord

  include Record
  include Searchable
  include Historical
  include Ownable
  include Flaggable
  #include DocumentUploader #TODO: refactor with block storage
  #include Importable #TODO: refactor with Import
  #include IncidentMonitoringRecording #TODO: Refactor with Violations

  store_accessor :data,
    :incident_id, :incidentid_ir, :individual_ids, :incident_code, :description, :super_incident_name,
    :incident_detail_id, :incident_description, :monitor_number, :survivor_code, :date_of_first_report,
    :date_of_incident_date_or_date_range, :incident_date, :date_of_incident, :date_of_incident_from, :date_of_incident_to,
    :individual_details_subform_section,
    :health_medical_referral_subform_section, :psychosocial_counseling_services_subform_section,
    :legal_assistance_services_subform_section, :police_or_other_type_of_security_services_subform_section,
    :livelihoods_services_subform_section, :child_protection_services_subform_section

  belongs_to :case, foreign_key: 'incident_case_id', class_name: 'Child', optional: true

  scope :by_incident_detail_id, ->(incident_detail_id) { where('data @> ?', {incident_detail_id: incident_detail_id}.to_json) }

  def self.quicksearch_fields
    %w(incident_id incident_code super_incident_name incident_description
       monitor_number survivor_code individual_ids incidentid_ir
    )
  end

  searchable auto_index: self.auto_index? do
    date :incident_date_derived do
      self.incident_date_derived
    end

    quicksearch_fields.each do |f|
      text(f) { self.data[f] }
    end
  end

  validate :validate_date_of_first_report

  before_update :clean_incident_date

  alias super_defaults defaults
  def defaults
    super_defaults
    self.date_of_first_report ||= Date.today
  end

  def self.new_incident_from_case(module_id, child=nil, from_module_id=nil, incident_detail_id=nil)
    incident = Incident.new
    incident.module_id = module_id

    if child.present?
      incident.incident_case_id = child.id
      if incident_detail_id.present?
        incident.incident_detail_id = incident_detail_id
      end

      incident_map = self.incident_mapping(from_module_id)
      incident.copy_case_information(child, incident_detail_id, incident_map, )
      #TODO: All Primero handling of dates should be refactored
      #This provides the current date according to local time
      #Typically things saved to models should be in UTC, but this is an exception
      #What matters here is the date for the person creating the incident
      #After its creation the date will not have a timezone
      incident.date_of_first_report = DateTime.current.to_date
      incident.status = STATUS_OPEN
    end
    return incident
  end


  def self.minimum_reportable_fields
    {
      'boolean' => ['record_state'],
      'string' => ['status', 'owned_by'],
      'multistring' => ['associated_user_names', 'owned_by_groups'],
      'date' => ['incident_date_derived']
    }
  end

  def set_instance_id
    self.incident_id ||= self.unique_identifier
    self.incident_code ||= (self.unique_identifier || "").last 7
  end

  #TODO: Rspec!
  #Copy some fields values from Survivor Information to GBV Individual Details.
  def copy_case_information(case_record, incident_id, mapping)
    if mapping.present?
      mapping.each do |record_mapping|
        #source_value = case_record
        target_key = record_mapping["target"]
        source_key = record_mapping["source"][0]
        if source_key == "incident_details"
          incident_key = record_mapping["source"][1]
          incident_details = source_value[source_key]
          incident_detail = incident_details.find{|incident| incident["unique_id"] == incident_id}
          source_value = incident_detail[incident_key] if incident_detail.present?
        else
          source_value = case_record[source_key]
        end
        self.data[target_key] = source_value unless source_value.nil?
      end
    end
  end

  DEFAULT_INCIDENT_MAPPING = [
    {"source" => ["survivor_code_no"], "target" => "survivor_code"},
    {"source" => ["age"], "target" => "age"},
    {"source" => ["date_of_birth"], "target" => "date_of_birth"},
    {"source" => ["sex"], "target" => "sex"},
    {"source" => ["gbv_ethnicity"], "target" => "ethnicity"},
    {"source" => ["country_of_origin"], "target" => "country_of_origin"},
    {"source" => ["gbv_nationality"], "target" => "nationality"},
    {"source" => ["gbv_religion"], "target" => "religion"},
    {"source" => ["maritial_status"], "target" => "maritial_status"},
    {"source" => ["gbv_displacement_status"], "target" => "displacement_status"},
    {"source" => ["gbv_disability_type"], "target" => "disability_type"},
    {"source" => ["unaccompanied_separated_status"], "target" => "unaccompanied_separated_status"}
  ]

  def incident_mapping(from_module_id)
    incident_map = Incident::DEFAULT_INCIDENT_MAPPING
    if from_module_id.present?
      from_module = PrimeroModule.find_by(unique_id: from_module_id)
      if from_module.present?
        incident_map = from_module.field_map_fields if from_module.field_map_fields.present?
      end
    end
    return incident_map
  end

  #Returns the 20 latest open incidents. Used in dashboards.
  # TODO: Jacob's designs drop this? Delete? Refactor UIUX
  #TODO refactoring pagination?
  def self.open_incidents(user)
    filters = { "record_state" =>{:type => "single", :value => "true"},
                "module_id" => {:type => "single", :value => PrimeroModule::MRM},
                "status" => {:type => "single", :value => STATUS_OPEN},
              }
    self.list_records(filters=filters, sort={:created_at => :desc}, pagination={ per_page: 20 }, user.managed_user_names).results
  end

  #Returns the 20 latest open incidents. Used in dashboards.
  # TODO: Jacob's designs drop this? Delete?, Refactor UIUX
  def self.open_gbv_incidents(user)
    filters = { "record_state" =>{:type => "single", :value => "true"},
                "module_id" => {:type => "single", :value => PrimeroModule::GBV},
                "status" => {:type => "single", :value => STATUS_OPEN},
              }
    self.list_records(filters=filters, sort={:created_at => :desc}, pagination={ per_page: 20 }, user.managed_user_names).results
  end

  def validate_date_of_first_report
    if self.date_of_first_report.present? && (!self.date_of_first_report.is_a?(Date) || self.date_of_first_report > Date.today)
      errors.add(:date_of_first_report, I18n.t("messages.enter_valid_date"))
      error_with_section(:date_of_first_report, I18n.t("messages.enter_valid_date"))
      false
    else
      true
    end
  end

  def clean_incident_date
    if self.date_of_incident_date_or_date_range == 'date'
      self.date_of_incident_from = nil
      self.date_of_incident_to = nil
    else
      self.date_of_incident = nil
    end
  end

  #TODO - Need rspec test for this
  def incident_date_derived
    return self.incident_date if self.incident_date.present?
    return self.date_of_incident_from if self.date_of_incident_from.present?
    return self.date_of_incident if self.date_of_incident.present?
    return nil
  end

  #To format the value in the export of the view list.
  def incident_date_to_export
    if self.date_of_incident_from.present? && self.date_of_incident_to.present?
      "#{self.date_of_incident_from.strftime('%d-%b-%Y')} - #{self.date_of_incident_to.strftime('%d-%b-%Y')}"
    elsif self.date_of_incident.present?
      I18n.l(self.date_of_incident)
    elsif self.incident_date.present?
      I18n.l(self.incident_date)
    end
  end

end
