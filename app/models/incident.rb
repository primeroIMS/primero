# frozen_string_literal: true

# Model representing an event. Some events are correlated to a case, forming a historical record.
class Incident < ApplicationRecord
  include Record
  include Searchable
  include Historical
  include Ownable
  include Flaggable
  include Alertable
  include Attachable
  include EagerLoadable
  include Kpi::GBVIncident
  # include IncidentMonitoringRecording #TODO: Refactor with Violations

  store_accessor(
    :data,
    :unique_id, :incident_id, :incidentid_ir, :individual_ids, :incident_code, :description, :super_incident_name,
    :incident_detail_id, :incident_description, :monitor_number, :survivor_code, :date_of_first_report,
    :date_of_incident_date_or_date_range, :incident_date, :date_of_incident, :date_of_incident_from,
    :date_of_incident_to, :individual_details_subform_section, :incident_location,
    :health_medical_referral_subform_section, :psychosocial_counseling_services_subform_section,
    :legal_assistance_services_subform_section, :police_or_other_type_of_security_services_subform_section,
    :livelihoods_services_subform_section, :child_protection_services_subform_section
  )

  belongs_to :case, foreign_key: 'incident_case_id', class_name: 'Child', optional: true

  def self.quicksearch_fields
    %w[incident_id incident_code super_incident_name incident_description
       monitor_number survivor_code individual_ids incidentid_ir]
  end

  def self.summary_field_names
    common_summary_fields + %w[
      date_of_interview date_of_incident violence_type
      incident_location violations social_worker date_of_first_report
      cp_incident_violence_type
      gbv_sexual_violence_type incident_date survivor_code
    ]
  end

  def self.sortable_text_fields
    %w[short_id]
  end

  searchable do
    date :incident_date_derived
    date :date_of_first_report
    string :status, as: 'status_sci'
    quicksearch_fields.each { |f| text_index(f) }
    sortable_text_fields.each { |f| string("#{f}_sortable", as: "#{f}_sortable_sci") { data[f] }}
  end

  after_initialize :set_unique_id
  before_save :copy_from_case
  # TODO: Reconsider whether this is necessary.
  # We will only be creating an incident from a case using a special business logic that
  # will certainly trigger a reindex on the case
  after_save :index_record
  after_create :add_alert_on_case, :add_case_history

  def index_record
    Sunspot.index!(self.case) if self.case.present?
  end

  alias super_defaults defaults
  def defaults
    super_defaults
    self.date_of_first_report ||= Date.today
  end

  class << self
    alias super_new_with_user new_with_user
    def new_with_user(user, data = {})
      super_new_with_user(user, data).tap do |incident|
        incident.incident_case_id ||= incident.data.delete('incident_case_id')
      end
    end

    def minimum_reportable_fields
      {
        'boolean' => %w[record_state],
        'string' => %w[status owned_by],
        'multistring' => %w[associated_user_names owned_by_groups],
        'date' => %w[incident_date_derived]
      }
    end
  end

  def copy_from_case
    return unless incident_case_id && will_save_change_to_attribute?(:incident_case_id)

    IncidentCreationService.copy_from_case(self, self.case, module_id)
  end

  def set_instance_id
    self.incident_id ||= unique_identifier
    self.incident_code ||= incident_id.to_s.last(7)
  end

  def set_unique_id
    self.unique_id = id
  end

  def incident_date_derived
    incident_date || date_of_incident_from || date_of_incident
  end

  def case_id_display
    return unless incident_case_id.present?

    self.case&.case_id_display
  end

  def add_alert_on_case
    return unless alerts_on_change.present?

    form_name = alerts_on_change[ALERT_INCIDENT]

    return unless form_name.present?
    return unless self.case.present? && created_by != self.case.owned_by

    self.case.add_alert(alert_for: FIELD_CHANGE, date: Date.today, type: form_name, form_sidebar_id: form_name)

    self.case.save!
  end

  def add_case_history
    return unless incident_case_id.present?
    return unless self.case.present?

    old_values = self.case.incident_ids.reject { |incident_id| incident_id == id }
    new_values = self.case.incident_ids

    RecordHistory.create!(
      record: self.case, record_type: self.case.class.name, user_name: created_by,
      datetime: created_at, action: Historical::EVENT_UPDATE, record_changes: {
        incidents: { from: old_values, to: new_values }
      }
    )

    self.case.save!
  end
end
