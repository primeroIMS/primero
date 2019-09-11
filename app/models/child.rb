class Child < ApplicationRecord
  self.table_name = 'cases'

  CHILD_PREFERENCE_MAX = 3
  RISK_LEVEL_HIGH = 'high' ; RISK_LEVEL_NONE = 'none'

  class << self
    def parent_form
      'case'
    end

    def model_name_for_messages
      'case'
    end
  end

  def locale_prefix
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
  include Serviceable #TODO: refactor with nested
  include Workflow
  include Flaggable
  include Transitionable
  include Reopenable
  include Approvable
  include Alertable
  include Matchable
  include Attachable
  # include Importable #TODO: Refactor with Imports and Exports

  store_accessor :data,
    :case_id, :case_id_code, :case_id_display,
    :nickname, :name, :protection_concerns, :consent_for_tracing, :hidden_name,
    :name_first, :name_middle, :name_last, :name_nickname, :name_other,
    :registration_date, :age, :estimated, :date_of_birth, :sex, :address_last,
    :reunited, :reunited_message, :investigated, :verified, #TODO: These are RapidFTR attributes and should be removed
    :risk_level, :case_status_reopened, :date_case_plan, :case_plan_due_date, :date_case_plan_initiated,
    :system_generated_followup,
    :assessment_due_date, :assessment_requested_on,
    :followup_subform_section, :protection_concern_detail_subform_section, #TODO: Do we need followups, protection_concern_details aliases?
    :disclosure_other_orgs,
    :ration_card_no, :icrc_ref_no, :unhcr_id_no, :unhcr_individual_no, :un_no, :other_agency_id,
    :survivor_code_no, :national_id_no, :other_id_no, :biometrics_id, :family_count_no, :dss_id, :camp_id, :cpims_id,
    :tent_number, :nfi_distribution_id,
    :nationality, :ethnicity, :religion, :language, :sub_ethnicity_1, :sub_ethnicity_2, :country_of_origin,
    :displacement_status, :marital_status, :disability_type, :incident_details,
    :duplicate, :notes_section, :location_current, :tracing_status, :name_caregiver


  alias child_status status ; alias child_status= status=

  attach_documents fields: [:other_documents, :bia_documents, :bid_documents]
  attach_images fields: [:photos]
  attach_audio fields: [:recorded_audio]

  has_many :incidents
  belongs_to :matched_tracing_request, class_name: 'TracingRequest', optional: true

  has_many :duplicates, class_name: 'Child', foreign_key: 'duplicate_case_id'
  belongs_to :duplicate_of, class_name: 'Child', foreign_key: 'duplicate_case_id', optional: true

  scope :by_date_of_birth, -> { where.not('data @> ?', { date_of_birth: nil }.to_json) }

  def self.quicksearch_fields
    # The fields family_count_no and dss_id are hacked in only because of Bangladesh
    # The fields camp_id, tent_number and nfi_distribution_id are hacked in only because of Iraq
    %w[ unique_identifier short_id case_id_display name name_nickname name_other
        ration_card_no icrc_ref_no rc_id_no unhcr_id_no unhcr_individual_no un_no
        other_agency_id survivor_code_no national_id_no other_id_no biometrics_id
        family_count_no dss_id camp_id tent_number nfi_distribution_id ]
  end

  def self.summary_field_names
    %w[ case_id_display name survivor_code_no age sex registration_date created_at
        owned_by owned_by_agency photos flag_count hidden_name workflow]
  end

  searchable auto_index: self.auto_index? do
    extend Matchable::Searchable
    configure_searchable(Child)

    quicksearch_fields.each do |f|
      text(f) { self.data[f] }
    end

    %w[date_case_plan_initiated assessment_requested_on].each{|f| date(f)}

    boolean :estimated
    integer :day_of_birth

    string :child_status, as: 'child_status_sci'
    string :risk_level, as: 'risk_level_sci' do
      self.risk_level.present? ? self.risk_level : RISK_LEVEL_NONE
    end

    date :assessment_due_dates, multiple: true do
      Tasks::AssessmentTask.from_case(self).map(&:due_date)
    end

    date :case_plan_due_dates, multiple: true do
      Tasks::CasePlanTask.from_case(self).map(&:due_date)
    end

    date :followup_due_dates, multiple: true do
      Tasks::FollowUpTask.from_case(self).map(&:due_date)
    end
  end


  validate :validate_date_of_birth
  validate :validate_registration_date
  validate :validate_child_wishes

  before_save :sync_protection_concerns
  before_save :auto_populate_name
  before_create :hide_name

  alias super_defaults defaults
  def defaults
    super_defaults
    self.registration_date ||= Date.today
    self.notes_section ||= []
  end

  def subform_match_values(field)
    family_detail_values(field)
  end

  def family_detail_values(field)
    self.data['family_details_section'].map { |fds| fds[field] }.compact.uniq.join(' ') if self.data['family_details_section'].present?
  end

  def self.report_filters
    [
        {'attribute' => 'child_status', 'value' => [STATUS_OPEN]},
        {'attribute' => 'record_state', 'value' => ['true']}
    ]
  end

  #TODO - does this need reporting location???
  #TODO - does this need the reporting_location_config field key
  # TODO: refactor with nested
  def self.minimum_reportable_fields
    {
        'boolean' => ['record_state'],
         'string' => ['child_status', 'sex', 'risk_level', 'owned_by_agency', 'owned_by', 'workflow', 'workflow_status', 'risk_level'],
    'multistring' => ['associated_user_names', 'owned_by_groups'],
           'date' => ['registration_date'],
        'integer' => ['age'],
       'location' => ['owned_by_location', 'location_current']
    }
  end

  def self.nested_reportable_types
    [ReportableProtectionConcern, ReportableService, ReportableFollowUp]
  end

  def self.by_date_of_birth_range(start_date, end_date)
    if start_date.is_a?(Date) && end_date.is_a?(Date)
      start_yday = normal_yday(start_date)
      end_yday = normal_yday(end_date)
      Child.search do
        with(:day_of_birth, start_yday..end_yday)
      end.results
    end
  end

  alias super_index_for_search index_for_search
  def index_for_search
    super_index_for_search
    self.index_nested_reportables
  end

  def validate_date_of_birth
    if self.date_of_birth.present? && (!self.date_of_birth.is_a?(Date) || self.date_of_birth.year > Date.today.year)
      errors.add(:date_of_birth, I18n.t("errors.models.child.date_of_birth"))
      #error_with_section(:date_of_birth, I18n.t("errors.models.child.date_of_birth")) #TODO: Remove with UIUIX?
      false
    else
      true
    end
  end

  def validate_registration_date
    if self.registration_date.present? && (!self.registration_date.is_a?(Date) || self.registration_date.year > Date.today.year)
      errors.add(:registration_date, I18n.t("messages.enter_valid_date"))
      #error_with_section(:registration_date, I18n.t("messages.enter_valid_date")) #TODO: Remove with UIUIX?
      false
    else
      true
    end
  end

  def validate_child_wishes
    return true if self.data['child_preferences_section'].nil? || self.data['child_preferences_section'].size <= CHILD_PREFERENCE_MAX
    errors.add(:child_preferences_section, I18n.t("errors.models.child.wishes_preferences_count", :preferences_count => CHILD_PREFERENCE_MAX))
    #TODO: Remove with UIUIX?
    #error_with_section(:child_preferences_section, I18n.t("errors.models.child.wishes_preferences_count", :preferences_count => CHILD_PREFERENCE_MAX))
  end

  def to_s
    if self.name.present?
      "#{self.name} (#{self.unique_identifier})"
    else
      self.unique_identifier
    end
  end

  def auto_populate_name
    #This 2 step process is necessary because you don't want to overwrite self.name if auto_populate is off
    a_name = auto_populate('name')
    self.name = a_name if a_name.present?
  end

  def hide_name
    self.hidden_name = true if self.module_id == PrimeroModule::GBV
  end

  def set_instance_id
    system_settings = SystemSettings.current
    self.case_id ||= self.unique_identifier
    self.case_id_code ||= auto_populate('case_id_code', system_settings)
    self.case_id_display ||= create_case_id_display(system_settings)
  end

  def create_case_id_code(system_settings)
    separator = (system_settings.present? && system_settings.case_code_separator.present? ? system_settings.case_code_separator : '')
    id_code_parts = []
    if system_settings.present? && system_settings.case_code_format.present?
      system_settings.case_code_format.each { |cf| id_code_parts << PropertyEvaluator.evaluate(self, cf) }
    end
    id_code_parts.reject(&:blank?).join(separator)
  end

  def create_case_id_display(system_settings)
    [self.case_id_code, self.short_id].reject(&:blank?).join(self.auto_populate_separator('case_id_code', system_settings))
  end

  def sortable_name
    self.name
  end

  def family(relation=nil)
    result = self.data['family_details_section'] || []
    if relation.present?
      result = result.select do |member|
        member['relation'] == relation
      end
    end
    return result
  end

  def fathers_name
    self.family('father').first.try(:[], 'relation_name')
  end

  def mothers_name
    self.family('mother').first.try(:[], 'relation_name')
  end

  def caregivers_name
    self.data['name_caregiver'] || self.family.select { |fd| fd['relation_is_caregiver'] }.first.try(:[], 'relation_name')
  end

  def day_of_birth
    if self.date_of_birth.is_a? Date
      Child.normal_yday(self.date_of_birth)
    end
  end

  def self.normal_yday(date)
    yday = date.yday
    if date.leap? && (yday >= 60)
      yday -= 1
    end
    return yday
  end

  # Solution below taken from...
  # http://stackoverflow.com/questions/819263/get-persons-age-in-ruby
  def calculated_age
    if self.date_of_birth.present? && self.date_of_birth.is_a?(Date)
      now = Date.current
      now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
    end
  end

  def sync_protection_concerns
    protection_concerns = self.protection_concerns
    protection_concern_subforms = self.data['protection_concern_detail_subform_section']
    if protection_concerns.present? && protection_concern_subforms.present?
      self.protection_concerns = (protection_concerns + protection_concern_subforms.map { |pc| pc['protection_concern_type'] }).compact.uniq
    end
  end

  def add_note(notes, note_subject, user)
    self.notes_section << {
        'field_notes_subform_fields' => notes, 'note_subject' => note_subject,
        'notes_date' => DateTime.now, 'note_created_by' => user.user_name
    }
  end

  def mark_as_duplicate(parent_id)
    self.duplicate = true
    self.duplicate_case_id = parent_id
  end

  def match_to_trace(tracing_request, trace)
    self.matched_tracing_request_id = tracing_request.id
    self.matched_trace_id = trace['unique_id']
  end

  def matched_to_trace?(tracing_request, trace)
    self.matched_tracing_request_id.present? && self.matched_trace_id.present? &&
        (self.matched_trace_id == trace['unique_id']) && (self.matched_tracing_request_id == tracing_request.id)
  end

  def matching_tracing_requests(case_fields = {})
    matching_criteria = match_criteria(self.data, case_fields)
    match_result = Child.find_match_records(matching_criteria, TracingRequest, nil)
    PotentialMatch.matches_from_search(match_result) do |tr_id, score, average_score|
      tracing_request = TracingRequest.find_by(id: tr_id)
      traces = tracing_request.try(:traces) || []
      traces.map do |trace|
        PotentialMatch.build_potential_match(self, tracing_request, score, average_score, trace['unique_id'])
      end
    end.flatten
  end

  alias :inherited_match_criteria :match_criteria
  def match_criteria(match_request=nil, case_fields=nil)
    match_criteria = inherited_match_criteria(match_request, case_fields)
    match_criteria_subform = {}
    Child.subform_matchable_fields(case_fields).each do |field|
      match_values = []
      match_field = nil
      self.family.map do |member|
        match_field, match_value = Child.match_multi_criteria(field, member)
        match_values += match_value
      end
      match_criteria_subform[:"#{match_field}"] = match_values if match_values.present?
    end
    match_criteria.merge(match_criteria_subform) { |_key, v1, v2| v1 + v2 }.compact
  end

  def reopen(status, reopen_status, user_name)
    self.child_status = status
    self.case_status_reopened = reopen_status
    self.add_reopened_log(user_name)
  end

  #Override method in record concern
  def display_id
    case_id_display
  end

  def primary_photo
    primary_photo = self.photos.find(&:is_current?) || self.photos.try(:first)
    primary_photo.try(:image)
  end

end
