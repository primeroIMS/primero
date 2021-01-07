# frozen_string_literal: true

# rubocop:disable Metrics/ClassLength
# The truth of it is, this is a long class.
# Just the same, it shouldn't exceed 300 lines (250 lines of active code).

# The central Primero model object that represents an individual's case.
# In spite of the name, this will represent adult cases as well.
class Child < ApplicationRecord
  RISK_LEVEL_HIGH = 'high'
  RISK_LEVEL_NONE = 'none'
  NAME_FIELDS = %w[name name_nickname name_other].freeze

  self.table_name = 'cases'

  def self.parent_form
    'case'
  end

  # This module updates photo_keys with the before_save callback and needs to
  # run before the before_save callback in Historical to make the history
  include Record
  include Searchable
  include Historical
  include BIADerivedFields
  include CaseDerivedFields
  include UNHCRMapping
  include Ownable
  include AutoPopulatable
  include Serviceable
  include Workflow
  include Flaggable
  include Transitionable
  include Reopenable
  include Approvable
  include Alertable
  include Attachable
  include Noteable
  include KPI::GBVChild

  store_accessor(
    :data,
    :case_id, :case_id_code, :case_id_display,
    :nickname, :name, :protection_concerns, :consent_for_tracing, :hidden_name,
    :name_first, :name_middle, :name_last, :name_nickname, :name_other,
    :registration_date, :age, :estimated, :date_of_birth, :sex, :address_last,
    :risk_level, :date_case_plan, :case_plan_due_date, :date_case_plan_initiated,
    :date_closure, :assessment_due_date, :assessment_requested_on,
    :followup_subform_section, :protection_concern_detail_subform_section,
    :disclosure_other_orgs,
    :ration_card_no, :icrc_ref_no, :unhcr_id_no, :unhcr_individual_no, :un_no, :other_agency_id,
    :survivor_code_no, :national_id_no, :other_id_no, :biometrics_id, :family_count_no, :dss_id, :camp_id, :cpims_id,
    :tent_number, :nfi_distribution_id,
    :nationality, :ethnicity, :religion, :language, :sub_ethnicity_1, :sub_ethnicity_2, :country_of_origin,
    :displacement_status, :marital_status, :disability_type, :incident_details,
    :location_current, :tracing_status, :name_caregiver,
    :urgent_protection_concern, :child_preferences_section, :family_details_section, :has_case_plan,
    :duplicate
  )

  has_many :incidents, foreign_key: :incident_case_id
  has_many :matched_traces, class_name: 'Trace', foreign_key: 'matched_case_id'
  has_many :duplicates, class_name: 'Child', foreign_key: 'duplicate_case_id'
  belongs_to :duplicate_of, class_name: 'Child', foreign_key: 'duplicate_case_id', optional: true

  scope :by_date_of_birth, -> { where.not('data @> ?', { date_of_birth: nil }.to_json) }

  def self.quicksearch_fields
    # The fields family_count_no and dss_id are hacked in only because of Bangladesh
    # The fields camp_id, tent_number and nfi_distribution_id are hacked in only because of Iraq
    %w[ unique_identifier short_id case_id_display
        ration_card_no icrc_ref_no rc_id_no unhcr_id_no unhcr_individual_no un_no
        other_agency_id survivor_code_no national_id_no other_id_no biometrics_id
        family_count_no dss_id camp_id tent_number nfi_distribution_id ] + NAME_FIELDS
  end

  def self.summary_field_names
    common_summary_fields + %w[
      case_id_display name survivor_code_no age sex registration_date
      hidden_name workflow case_status_reopened
    ]
  end

  def self.alert_count_self(current_user_name)
    records_owned_by = open_enabled_records.owned_by(current_user_name)
    records_referred_users =
      open_enabled_records.select { |record| record.referred_users.include?(current_user_name) }
    (records_referred_users + records_owned_by).uniq.count
  end

  def self.child_matching_field_names
    MatchingConfiguration.matchable_fields('case', false).pluck(:name) | MatchingConfiguration::DEFAULT_CHILD_FIELDS
  end

  def self.family_matching_field_names
    MatchingConfiguration.matchable_fields('case', true).pluck(:name) | MatchingConfiguration::DEFAULT_INQUIRER_FIELDS
  end

  searchable do
    Child.child_matching_field_names.each { |f| text_index(f) }
    Child.family_matching_field_names.each { |f| text_index_from_subform('family_details_section', f) }
    (quicksearch_fields - NAME_FIELDS).each { |f| text_index(f) }
    %w[registration_date date_case_plan_initiated assessment_requested_on date_closure].each { |f| date(f) }
    %w[estimated urgent_protection_concern consent_for_tracing has_case_plan].each { |f| boolean(f) }
    %w[day_of_birth age].each { |f| integer(f) }
    %w[status sex national_id_no].each { |f| string(f, as: "#{f}_sci") }
    string :risk_level, as: 'risk_level_sci' do
      risk_level.present? ? risk_level : RISK_LEVEL_NONE
    end
    string :protection_concerns, multiple: true

    date :assessment_due_dates, multiple: true do
      Tasks::AssessmentTask.from_case(self).map(&:due_date)
    end
    date :case_plan_due_dates, multiple: true do
      Tasks::CasePlanTask.from_case(self).map(&:due_date)
    end
    date :followup_due_dates, multiple: true do
      Tasks::FollowUpTask.from_case(self).map(&:due_date)
    end
    boolean(:has_incidents) { incidents.size.positive? }

  end

  validate :validate_date_of_birth

  before_save :sync_protection_concerns
  before_save :auto_populate_name
  before_create :hide_name
  after_save :save_incidents

  alias super_defaults defaults
  def defaults
    super_defaults
    self.registration_date ||= Date.today
    self.notes_section ||= []
  end

  def self.report_filters
    [
      { 'attribute' => 'status', 'value' => [STATUS_OPEN] },
      { 'attribute' => 'record_state', 'value' => ['true'] }
    ]
  end

  # TODO: does this need reporting location???
  # TODO: does this need the reporting_location_config field key
  # TODO: refactor with nested
  def self.minimum_reportable_fields
    {
      'boolean' => ['record_state'],
      'string' => %w[status sex risk_level owned_by_agency_id owned_by workflow workflow_status risk_level],
      'multistring' => %w[associated_user_names owned_by_groups],
      'date' => ['registration_date'],
      'integer' => ['age'],
      'location' => %w[owned_by_location location_current]
    }
  end

  def self.nested_reportable_types
    [ReportableProtectionConcern, ReportableService, ReportableFollowUp]
  end

  def validate_date_of_birth
    return unless date_of_birth.present? && (!date_of_birth.is_a?(Date) || date_of_birth.year > Date.today.year)

    errors.add(:date_of_birth, I18n.t('errors.models.child.date_of_birth'))
  end

  alias super_update_properties update_properties
  def update_properties(user, data)
    build_or_update_incidents(user, (data.delete('incident_details') || []))
    self.mark_for_reopen = @incidents_to_save.present?
    super_update_properties(user, data)
  end

  def build_or_update_incidents(user, incidents_data)
    return unless incidents_data

    @incidents_to_save = incidents_data.map do |incident_data|
      incident = Incident.find_by(id: incident_data['unique_id'])
      incident ||= IncidentCreationService.incident_from_case(self, incident_data, module_id, user)
      unless incident.new_record?
        incident_data.delete('unique_id')
        incident.data = RecordMergeDataHashService.merge_data(incident.data, incident_data) unless incident.new_record?
      end
      incident.has_changes_to_save? ? incident : nil
    end.compact
  end

  def save_incidents
    return unless @incidents_to_save

    Incident.transaction do
      @incidents_to_save.each(&:save!)
    end
  end

  def to_s
    name.present? ? "#{name} (#{unique_identifier})" : unique_identifier
  end

  def auto_populate_name
    # This 2 step process is necessary because you don't want to overwrite self.name if auto_populate is off
    a_name = auto_populate('name')
    self.name = a_name if a_name.present?
  end

  def hide_name
    self.hidden_name = true if module_id == PrimeroModule::GBV
  end

  def set_instance_id
    system_settings = SystemSettings.current
    self.case_id ||= unique_identifier
    self.case_id_code ||= auto_populate('case_id_code', system_settings)
    self.case_id_display ||= create_case_id_display(system_settings)
  end

  def create_case_id_code(system_settings)
    separator = system_settings&.case_code_separator.present? ? system_settings.case_code_separator : ''
    id_code_parts = []
    if system_settings.present? && system_settings.case_code_format.present?
      system_settings.case_code_format.each { |cf| id_code_parts << PropertyEvaluator.evaluate(self, cf) }
    end
    id_code_parts.reject(&:blank?).join(separator)
  end

  def create_case_id_display(system_settings)
    [case_id_code, short_id].compact.join(auto_populate_separator('case_id_code', system_settings))
  end

  def display_id
    case_id_display
  end

  def day_of_birth
    return nil unless date_of_birth.is_a? Date

    AgeService.day_of_year(date_of_birth)
  end

  def sync_protection_concerns
    protection_concerns = self.protection_concerns || []
    from_subforms = protection_concern_detail_subform_section&.map { |pc| pc['protection_concern_type'] }&.compact || []
    self.protection_concerns = (protection_concerns + from_subforms).uniq
  end

  def match_criteria
    match_criteria = data.slice(*Child.child_matching_field_names).compact
    match_criteria = match_criteria.merge(
      Child.family_matching_field_names.map do |field_name|
        [field_name, values_from_subform('family_details_section', field_name)]
      end.to_h
    )
    match_criteria = match_criteria.transform_values { |v| v.is_a?(Array) ? v.join(' ') : v }
    match_criteria.select { |_, v| v.present? }
  end

  def matches_to
    Trace
  end

  def associations_as_data(current_user = nil)
    return @associations_as_data if @associations_as_data

    incident_details = RecordScopeService.scope_with_user(incidents, current_user).map do |incident|
      incident.data&.reject { |_, v| RecordMergeDataHashService.array_of_hashes?(v) }
    end.compact || []
    @associations_as_data = { 'incident_details' => incident_details }
  end

  def associations_as_data_keys
    %w[incident_details]
  end
end
# rubocop:enable Metrics/ClassLength
