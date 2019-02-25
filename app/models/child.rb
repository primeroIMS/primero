class Child < ActiveRecord::Base
  self.table_name = 'cases'

  CHILD_PREFERENCE_MAX = 3
  RISK_LEVEL_HIGH = 'high'
  RISK_LEVEL_NONE = 'none'

  APPROVAL_STATUS_PENDING = 'pending'
  APPROVAL_STATUS_REQUESTED = 'requested'
  APPROVAL_STATUS_APPROVED = 'approved'
  APPROVAL_STATUS_REJECTED = 'rejected'

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
  #include PhotoUploader #TODO: refactor with block storage
  include RecordJson
  include Searchable
  include Historical
  #include DocumentUploader #TODO: refactor with block storage
  #include BIADerivedFields #TODO: refactor with business logic 2
  #include CaseDerivedFields #TODO: refactor with business logic 2
  #include UNHCRMapping #TODO: refactor with business logic 2
  include Ownable #TODO: refactor with business logic 2
  #include Matchable #TODO: refactor with business logic 2
  #include AudioUploader #TODO: refactor with block storage
  include AutoPopulatable

  #It is important that Workflow is included AFTER Serviceable
  #Workflow statuses is expecting the servicable callbacks to have already happened
  #include Serviceable #TODO: refactor with nested
  #include Workflow #TODO: refactor with business logic 2
  def workflow ; nil ; end #TODO delete after refactoring Workflow
  def workflow_status ; nil ; end #TODO delete after refactoring Workflow
  def self.workflow_statuses(*args) ; [] ; end #TODO delete after refactoring Workflow
  def photos ; [] ; end #TODO: delete after refactoring Documents
  def has_valid_audio? ; nil ; end #TODO: delete after refactoring Documents
  attr_accessor :base_revision #TODO: delete after figuring out locking

  store_accessor :data,
    :case_id, :case_id_code, :case_id_display,
    :nickname, :name, :protection_concerns, :consent_for_tracing, :hidden_name,
    :registration_date, :age, :date_of_birth, :sex,
    :reunited, :reunited_message, :investigated, :verified, #TODO: These are RapidFTR attributes and should be removed
    :risk_level, :child_status, :case_status_reopened,
    :system_generated_followup

  #TODO: Refactor with Incidents, TRs
  #To hold the list of GBV Incidents created from a GBV Case.
  # property :incident_links, [], :default => []
  # property :matched_tracing_request_id

  validate :validate_date_of_birth
  validate :validate_registration_date
  validate :validate_child_wishes

  after_initialize :defaults
  before_save :sync_protection_concerns
  before_save :auto_populate_name
  before_create :hide_name

  #TODO: Value defaults
  def initialize(*args)
    # self['photo_keys'] ||= []
    # self['document_keys'] ||= []
    super *args
  end

  def defaults
    self.child_status ||= Record::STATUS_OPEN
  end


  #include Flaggable #TODO: Refactor with Flag
  #include Transitionable #TODO: Refactor with Transitions
  #include Reopenable #TODO: refactor with business logic 2
  #include Approvable #TODO: refactor with business logic 2
  #include Alertable #TODO: refactor with business logic 2

  def self.quicksearch_fields
    # The fields family_count_no and dss_id are hacked in only because of Bangladesh
    # The fields camp_id, tent_number and nfi_distribution_id are hacked in only because of Iraq
    [
        'unique_identifier', 'short_id', 'case_id_display', 'name', 'name_nickname', 'name_other',
        'ration_card_no', 'icrc_ref_no', 'rc_id_no', 'unhcr_id_no', 'unhcr_individual_no','un_no',
        'other_agency_id', 'survivor_code_no', 'national_id_no', 'other_id_no', 'biometrics_id',
        'family_count_no', 'dss_id', 'camp_id', 'tent_number', 'nfi_distribution_id'
    ]
  end

  searchable auto_index: self.auto_index? do
    #TODO: Bring back with Matchable
    # form_matchable_fields.each do |field|
    #   text field, boost: Child.get_field_boost(field) do
    #     self.data[field]
    #   end
    #   if phonetic_fields_exist?(field)
    #     text field, as: "#{field}_ph" do
    #       self.data[field]
    #     end
    #   end
    # end
    #
    # subform_matchable_fields.each do |field|
    #   text field, :boost => Child.get_field_boost(field) do |record|
    #     record.family_detail_values(field)
    #   end
    #   if phonetic_fields_exist?(field)
    #     text field, :as => "#{field}_ph" do |record|
    #       record.family_detail_values(field)
    #     end
    #   end
    # end

    #TODO: why isnt this in the Searchable concern? Is this even needed when swe use the default Sunspot adapter?
    string :id do
      self.id
    end

    quicksearch_fields.each do |f|
      text(f) { self.data[f] }
    end

    boolean(:estimated) { self.data['estimated'] }
    boolean(:consent_for_services) { self.data['consent_for_services'] }
    #TODO: Refactor with Nested
    #time :service_due_dates, multiple: true

    #TODO: Refactor with Workflow. Should these be store_accessors?
    # string :workflow_status, as: 'workflow_status_sci'
    # string :workflow, as: 'workflow_sci'

    string :child_status, as: 'child_status_sci'
    string :risk_level, as: 'risk_level_sci' do
      self.risk_level.present? ? self.risk_level : RISK_LEVEL_NONE
    end

    #TODO: Refactor with Nested
    # date :assessment_due_dates, multiple: true do
    #   Tasks::AssessmentTask.from_case(self).map &:due_date
    # end
    #
    # date :case_plan_due_dates, multiple: true do
    #   Tasks::CasePlanTask.from_case(self).map &:due_date
    # end
    #
    # date :followup_due_dates, multiple: true do
    #   Tasks::FollowUpTask.from_case(self).map &:due_date
    # end
  end

  #TODO: refactor with FamilyDetails
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

  # TODO: refactor with nested
  def self.nested_reportable_types
    [ReportableProtectionConcern, ReportableService, ReportableFollowUp]
  end

  def self.by_date_of_birth_range(start_date, end_date)
    if start_date.is_a?(Date) && end_date.is_a?(Date)
      Child.search do
        with(:date_of_birth).between(start_date..end_date)
      end.results
    end
  end

  #TODO: refactor with Incident
  def add_incident_links(incident_detail_id, incident_id, incident_display_id)
    #self.incident_links << {"incident_details" => incident_detail_id, "incident_id" => incident_id, "incident_display_id" => incident_display_id}
  end

  def validate_date_of_birth
    #TODO: How do we do casted types?
    if date_of_birth.present? && (!date_of_birth.is_a?(Date) || date_of_birth.year > Date.today.year)
      errors.add(:date_of_birth, I18n.t("errors.models.child.date_of_birth"))
      #error_with_section(:date_of_birth, I18n.t("errors.models.child.date_of_birth")) #TODO: Remove with UIUIX?
      false
    else
      true
    end
  end

  def validate_registration_date
    #TODO: How do we do casted types?
    if registration_date.present? && (!registration_date.is_a?(Date) || registration_date.year > Date.today.year)
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

  #TODO:  Refactor when defaulting, initializing
  def set_instance_id
    system_settings = SystemSettings.current
    self.case_id ||= self.unique_identifier
    self.case_id_code ||= auto_populate('case_id_code', system_settings)
    self.case_id_display ||= create_case_id_display(system_settings)
  end

  #TODO:  Refactor when defaulting, initializing
  def create_case_id_code(system_settings)
    separator = (system_settings.present? && system_settings.case_code_separator.present? ? system_settings.case_code_separator : '')
    id_code_parts = []
    if system_settings.present? && system_settings.case_code_format.present?
      system_settings.case_code_format.each { |cf| id_code_parts << PropertyEvaluator.evaluate(self, cf) }
    end
    id_code_parts.reject(&:blank?).join(separator)
  end

  #TODO:  Refactor when defaulting, initializing
  def create_case_id_display(system_settings)
    [self.case_id_code, self.short_id].reject(&:blank?).join(self.auto_populate_separator('case_id_code', system_settings))
  end

  #TODO:  Refactor when defaulting, initializing
  def create_class_specific_fields(fields)
    #TODO - handle timezone adjustment  (See incident.date_of_first_report)
    self.registration_date ||= Date.today
  end

  def sortable_name
    self['name']
  end

  #TODO: Refactor with FamilyDetails or just delete. Nothing but specs use this
  def family(relation=nil)
    result = self.try(:family_details_section) || []
    if relation.present?
      result = result.select do |member|
        member.try(:relation) == relation
      end
    end
    return result
  end

  def fathers_name
    self.family('father').first.try(:relation_name)
  end

  def mothers_name
    self.family('mother').first.try(:relation_name)
  end

  def caregivers_name
    self.name_caregiver || self.family.select { |fd| fd.relation_is_caregiver == true }.first.try(:relation_name)
  end

  # Solution below taken from...
  # http://stackoverflow.com/questions/819263/get-persons-age-in-ruby
  # TODO: Refactor with casting
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

  #This method returns nil if object is nil
  def service_field_value(service_object, service_field)
    if service_object.present?
      service_object[service_field]
    end
  end

  #TODO: Refactor with Matchable
  def matched_to_trace?(trace_id)
    self.matched_tracing_request_id.present? &&
    (self.matched_tracing_request_id.split('::').last == trace_id)
  end

  #TODO: Refactor with Matchable
  #TODO: The method is broken: the check should be for 'tracing_request'.
  #      Not fixing because find_match_tracing_requests is a shambles.
  def has_tracing_request?
    # TODO: this assumes if tracing-request is in associated_record_types then the tracing request forms are also present. Add check for tracing-request forms.
    self.module.present? && self.module.associated_record_types.include?('tracing-request')
  end

  #TODO: Refactor with Matchable. Probably delete?
  #TODO v1.3: Need rspec test
  #TODO: Current logic:
  #  On an update to a case (already inefficient, because most updates to cases arent on matching fields),
  #  find all TRs that now match (using Solr).
  #  For those TRs invoke reverse matching logic (why? - probably because Lucene scores are not comparable between TR and Case seraches)
  #  and update/create the resulting PotentialMatches.
  #  Delete the untouched PotentialMatches that are no longer valid, because they are based on old searches.
  def find_match_tracing_requests
    if has_tracing_request? #This always returns false - bug :)
      match_result = Child.find_match_records(match_criteria, TracingRequest)
      tracing_request_ids = match_result==[] ? [] : match_result.keys
      all_results = TracingRequest.match_tracing_requests_for_case(self.id, tracing_request_ids).uniq
      results = all_results.sort_by { |result| result[:score] }.reverse.slice(0, 20)
      PotentialMatch.update_matches_for_child(self.id, results)
    end
  end

  #TODO: Refactor with Matchable.
  def matching_tracing_requests(case_fields = {})
    matching_criteria = match_criteria(nil, case_fields)
    match_result = Child.find_match_records(matching_criteria, TracingRequest, nil)
    PotentialMatch.matches_from_search(match_result) do |tr_id, score, average_score|
      traces = TracingRequest.get(tr_id).try(:traces) || []
      traces.map do |trace|
        PotentialMatch.build_potential_match(self.id, tr_id, score, average_score, trace.unique_id)
      end
    end
  end

  #TODO: Refactor with Matchable.
  # alias :inherited_match_criteria :match_criteria
  # def match_criteria(match_request=nil, case_fields=nil)
  #   match_criteria = inherited_match_criteria(match_request, case_fields)
  #   match_criteria_subform = {}
  #   Child.subform_matchable_fields(case_fields).each do |field|
  #     match_values = []
  #     match_field = nil
  #     self.family.map do |member|
  #       match_field, match_value = Child.match_multi_criteria(field, member)
  #       match_values += match_value
  #     end
  #     match_criteria_subform[:"#{match_field}"] = match_values if match_values.present?
  #   end
  #   match_criteria.merge(match_criteria_subform) { |_key, v1, v2| v1 + v2 }.compact
  # end

  #TODO: Refactor with Nested.
  def service_due_dates
    # TODO: only use services that is of the type of the current workflow
    reportable_services = self.nested_reportables_hash[ReportableService]
    if reportable_services.present?
      reportable_services.select do |service|
        !service.service_implemented?
      end.map do |service|
        service.service_due_date
      end.compact
    end
  end


  #TODO: Refactor with business logic 2
  def reopen(status, reopen_status, user_name)
    self.child_status = status
    self.case_status_reopened = reopen_status
    self.add_reopened_log(user_name)
  end

  #TODO: Refactor with business logic 2
  def send_approval_request_mail(approval_type, host_url)
    managers = self.owner.managers.select{ |manager| manager.email.present? && manager.send_mail }

    if managers.present?
      managers.each do |manager|
        ApprovalRequestJob.perform_later(self.owner.id, manager.id, self.id, approval_type, host_url)
      end
    else
      Rails.logger.info "Approval Request Mail not sent.  No managers present with send_mail enabled.  User - [#{self.owner.id}]"
    end
  end

  #TODO: Refactor with business logic 2
  def send_approval_response_mail(manager_id, approval_type, approval, host_url, is_gbv = false)
    ApprovalResponseJob.perform_later(manager_id, self.id, approval_type, approval, host_url, is_gbv)
  end

  #Override method in record concern
  def display_id
    case_id_display
  end

end
