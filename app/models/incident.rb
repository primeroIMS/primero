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
  include ReportableLocation
  # include IncidentMonitoringRecording #TODO: Refactor with Violations

  store_accessor(
    :data,
    :unique_id, :incident_id, :incidentid_ir, :individual_ids, :incident_code, :description, :super_incident_name,
    :incident_detail_id, :incident_description, :monitor_number, :survivor_code, :date_of_first_report,
    :date_of_incident_date_or_date_range, :incident_date, :date_of_incident, :date_of_incident_from,
    :date_of_incident_to, :individual_details_subform_section, :incident_location,
    :health_medical_referral_subform_section, :psychosocial_counseling_services_subform_section,
    :legal_assistance_services_subform_section, :police_or_other_type_of_security_services_subform_section,
    :livelihoods_services_subform_section, :child_protection_services_subform_section, :violation_category,
    :elapsed_reporting_time
  )

  has_many :violations, dependent: :destroy, inverse_of: :incident
  belongs_to :case, foreign_key: 'incident_case_id', class_name: 'Child', optional: true
  before_save :calculate_elapsed_reporting_time
  after_save :save_violations_and_associations

  class << self
    alias super_new_with_user new_with_user
    def new_with_user(user, data = {})
      violations_params = violations_data(Violation::TYPES, data)
      associations_params = violations_data(Violation::MRM_ASSOCIATIONS_KEYS, data)
      new_incident = super_new_with_user(user, data).tap do |incident|
        incident.incident_case_id ||= incident.data.delete('incident_case_id')
      end
      new_incident.build_or_update_violations(violations_params)
      new_incident.build_violations_associations(associations_params)
      new_incident
    end

    def filterable_id_fields
      %w[incident_id incident_code monitor_number survivor_code incidentid_ir short_id]
    end

    def quicksearch_fields
      filterable_id_fields + %w[super_incident_name incident_description individual_ids]
    end

    def summary_field_names
      common_summary_fields + %w[
        date_of_interview date_of_incident violence_type
        incident_location violations social_worker date_of_first_report
        cp_incident_violence_type
        gbv_sexual_violence_type incident_date survivor_code
        violation_category incident_date_derived
      ]
    end

    def sortable_text_fields
      %w[short_id]
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

  searchable do
    date :incident_date_derived
    date :date_of_first_report
    string :status, as: 'status_sci'
    filterable_id_fields.each { |f| string("#{f}_filterable", as: "#{f}_filterable_sci") { data[f] } }
    quicksearch_fields.each { |f| text_index(f) }
    sortable_text_fields.each { |f| string("#{f}_sortable", as: "#{f}_sortable_sci") { data[f] } }
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

    RecordHistory.create!(
      record: self.case, record_type: self.case.class.name, user_name: created_by,
      datetime: created_at, action: Historical::EVENT_UPDATE,
      record_changes: {
        incidents: { from: old_incident_values, to: new_incident_values }
      }
    )

    self.case.save!
  end

  def old_incident_values
    self.case.incident_ids.reject { |incident_id| incident_id == id }
  end

  def new_incident_values
    self.case.incident_ids
  end

  alias super_update_properties update_properties
  def update_properties(user, data)
    build_or_update_violations(Incident.violations_data(Violation::TYPES, data))
    build_violations_associations(Incident.violations_data(Violation::MRM_ASSOCIATIONS_KEYS, data))
    super_update_properties(user, data)
  end

  def self.violations_data(data_keys, data)
    return {} unless data

    data_keys.reduce({}) do |acc, elem|
      next acc unless data[elem].present?

      acc.merge(elem => data.delete(elem))
    end
  end

  def build_or_update_violations(violation_objects_data)
    return unless violation_objects_data.present?

    @violations_to_save = violation_objects_data.each_with_object([]) do |(type, violations_by_type), acc|
      violations_by_type.each do |violation_data|
        acc << Violation.build_record(type, violation_data, self)
      end
      acc
    end
  end

  def build_violations_associations(violation_associations_data)
    return unless violation_associations_data.present?

    @associations_to_save = violation_associations_data.each_with_object([]) do |(type, associations_data), acc|
      association_object = type.classify.constantize
      associations_data.each do |association_data|
        acc << association_object.build_record(association_data)
      end
      acc
    end
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

  def save_violations_and_associations
    save_violations
    save_violations_associations
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
    violations_result = []
    saved_violations = violations_already_saved(violations_ids)
    if @violations_to_save.present?
      violations_result += @violations_to_save.select { |violation| violations_ids.include?(violation.id) }
    end
    violations_result += Violation.where(id: saved_violations) if saved_violations

    violations_result
  end

  def violations_already_saved(violations_ids)
    @violations_to_save.present? ? @violations_to_save.map(&:id) - violations_ids : violations_ids
  end

  def calculate_elapsed_reporting_time
    return if incident_date.blank? || date_of_first_report.blank?

    calculated = (date_of_first_report - incident_date).to_i

    self.elapsed_reporting_time = '0_3_days' if calculated < 4
    self.elapsed_reporting_time = '4_5_days' if calculated.in?(4..5)
    self.elapsed_reporting_time = '6_14_days' if calculated.in?(6..14)
    self.elapsed_reporting_time = '2_weeks_1_month' if calculated.in?(15..30)
    self.elapsed_reporting_time = 'over_1_month' if calculated > 30
  end

  def reporting_location_property
    'incident_reporting_location_config'
  end
end
