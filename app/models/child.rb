#TODO: For now leaving CouchRest::Model::Base
#TODO: Inheriting from ApplicationRecord breaks created_at in the Historical Concern for some reason
class Child < CouchRest::Model::Base
  use_database :child

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

  include PrimeroModel
  include Primero::CouchRestRailsBackward

  # This module updates photo_keys with the before_save callback and needs to
  # run before the before_save callback in Historical to make the history
  include PhotoUploader
  include Record
  include DocumentUploader
  include BIADerivedFields
  include CaseDerivedFields
  include UNHCRMapping

  include Ownable
  include Matchable
  include AudioUploader
  include AutoPopulatable

  #It is important that Workflow is included AFTER Serviceable
  #Workflow statuses is expecting the servicable callbacks to have already happened
  include Serviceable
  include Workflow

  property :case_id
  property :case_id_code
  property :case_id_display
  property :nickname
  property :name
  property :protection_concerns
  property :consent_for_tracing, TrueClass
  property :hidden_name, TrueClass, :default => false
  property :registration_date, Date
  property :age, Integer
  property :date_of_birth, Date
  property :sex
  property :reunited, TrueClass
  property :reunited_message, String
  property :investigated, TrueClass
  property :verified, TrueClass
  property :risk_level
  property :child_status
  property :case_status_reopened, TrueClass, :default => false
  property :system_generated_followup, TrueClass, default: false
  #To hold the list of GBV Incidents created from a GBV Case.
  property :incident_links, [], :default => []
  property :matched_tracing_request_id

  validate :validate_date_of_birth
  validate :validate_registration_date
  validate :validate_child_wishes
  # validate :validate_date_closure

  before_save :sync_protection_concerns
  before_save :auto_populate_name

  def initialize *args
    self['photo_keys'] ||= []
    self['document_keys'] ||= []
    self['histories'] = []

    super *args
  end


  design do
    view :by_protection_status_and_gender_and_ftr_status #TODO: This may be deprecated. See lib/primero/weekly_report.rb
    view :by_date_of_birth

    view :by_name,
         :map => "function(doc) {
                  if (doc['couchrest-type'] == 'Child')
                 {
                    if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                      emit(doc['name'], null);
                    }
                 }
              }"

    view :by_ids_and_revs,
         :map => "function(doc) {
              if (doc['couchrest-type'] == 'Child'){
                emit(doc._id, {_id: doc._id, _rev: doc._rev});
              }
            }"

    view :by_generate_followup_reminders,
         :map => "function(doc) {
                       if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                         if (doc['couchrest-type'] == 'Child'
                             && doc['record_state'] == true
                             && doc['system_generated_followup'] == true
                             && doc['risk_level'] != null
                             && doc['child_status'] != null
                             && doc['registration_date'] != null) {
                           emit([doc['child_status'], doc['risk_level']], null);
                         }
                       }
                     }"

    view :by_followup_reminders_scheduled,
         :map => "function(doc) {
                       if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                         if (doc['record_state'] == true && doc.hasOwnProperty('flags')) {
                           for(var index = 0; index < doc['flags'].length; index++) {
                             if (doc['flags'][index]['system_generated_followup'] && !doc['flags'][index]['removed']) {
                               emit([doc['child_status'], doc['flags'][index]['date']], null);
                             }
                           }
                         }
                       }
                     }"

    view :by_followup_reminders_scheduled_invalid_record,
         :map => "function(doc) {
                       if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                         if (doc['record_state'] == false && doc.hasOwnProperty('flags')) {
                           for(var index = 0; index < doc['flags'].length; index++) {
                             if (doc['flags'][index]['system_generated_followup'] && !doc['flags'][index]['removed']) {
                               emit(doc['record_state'], null);
                             }
                           }
                         }
                       }
                     }"

    view :by_date_of_birth_month_day,
         :map => "function(doc) {
                  if (doc['couchrest-type'] == 'Child')
                 {
                    if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                      if (doc['date_of_birth'] != null) {
                        var dob = new Date(doc['date_of_birth']);
                        //Add 1 to month because getMonth() is indexed starting at 0
                        //i.e. January == 0, Februrary == 1, etc.
                        //Add 1 to align it with Date.month which is indexed starting at 1
                        emit([(dob.getMonth() + 1), dob.getDate()], null);
                      }
                    }
                 }
              }"
  end

  def self.quicksearch_fields
    # The fields family_count_no and dss_id are hacked in only because of Bangladesh
    [
      'unique_identifier', 'short_id', 'case_id_display', 'name', 'name_nickname', 'name_other',
      'ration_card_no', 'icrc_ref_no', 'rc_id_no', 'unhcr_id_no', 'unhcr_individual_no','un_no',
      'other_agency_id', 'survivor_code_no', 'national_id_no', 'other_id_no', 'biometrics_id',
      'family_count_no', 'dss_id'
    ]
  end

  include Flaggable
  include Transitionable
  include Reopenable
  include Approvable
  include Alertable

  # Searchable needs to be after other concern includes so that properties defined in those concerns get indexed
  include Searchable

  searchable do
    form_matchable_fields.select { |field| Child.exclude_match_field(field) }.each { |field| text field, :boost => Child.get_field_boost(field) }

    subform_matchable_fields.select { |field| Child.exclude_match_field(field) }.each do |field|
      text field, :boost => Child.get_field_boost(field) do
        self.family_details_section.map { |fds| fds[:"#{field}"] }.compact.uniq.join(' ') if self.try(:family_details_section)
      end
    end

    string :id do
      self['_id']
    end

    boolean :estimated
    boolean :consent_for_services

    time :service_due_dates, :multiple => true

    string :workflow_status, as: 'workflow_status_sci'
    string :workflow, as: 'workflow_sci'
    string :child_status, as: 'child_status_sci'
    string :created_agency_office, as: 'created_agency_office_sci'
    string :risk_level, as: 'risk_level_sci' do
      self.risk_level.present? ? self.risk_level : RISK_LEVEL_NONE
    end

    date :assessment_due_dates, multiple: true do
      Tasks::AssessmentTask.from_case(self).map &:due_date
    end

    date :case_plan_due_dates, multiple: true do
      Tasks::CasePlanTask.from_case(self).map &:due_date
    end

    date :followup_due_dates, multiple: true do
      Tasks::FollowUpTask.from_case(self).map &:due_date
    end
  end


  def self.report_filters
    [
        {'attribute' => 'child_status', 'value' => [STATUS_OPEN]},
        {'attribute' => 'record_state', 'value' => ['true']}
    ]
  end

  #TODO - does this need reporting location???
  #TODO - does this need the reporting_location_config field key
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

  def self.by_date_of_birth_range(startDate, endDate)
    if startDate.is_a?(Date) && endDate.is_a?(Date)
      self.by_date_of_birth_month_day(:startkey => [startDate.month, startDate.day], :endkey => [endDate.month, endDate.day]).all
    end
  end

  def add_incident_links(incident_detail_id, incident_id, incident_display_id)
    self.incident_links << {"incident_details" => incident_detail_id, "incident_id" => incident_id, "incident_display_id" => incident_display_id}
  end

  def validate_date_of_birth
    if date_of_birth.present? && (!date_of_birth.is_a?(Date) || date_of_birth.year > Date.today.year)
      errors.add(:date_of_birth, I18n.t("errors.models.child.date_of_birth"))
      error_with_section(:date_of_birth, I18n.t("errors.models.child.date_of_birth"))
      false
    else
      true
    end
  end

  def validate_registration_date
    if registration_date.present? && (!registration_date.is_a?(Date) || registration_date.year > Date.today.year)
      errors.add(:registration_date, I18n.t("messages.enter_valid_date"))
      error_with_section(:registration_date, I18n.t("messages.enter_valid_date"))
      false
    else
      true
    end
  end

  def validate_child_wishes
    return true if self['child_preferences_section'].nil? || self['child_preferences_section'].size <= CHILD_PREFERENCE_MAX
    errors.add(:child_preferences_section, I18n.t("errors.models.child.wishes_preferences_count", :preferences_count => CHILD_PREFERENCE_MAX))
    error_with_section(:child_preferences_section, I18n.t("errors.models.child.wishes_preferences_count", :preferences_count => CHILD_PREFERENCE_MAX))
  end

  # def validate_date_closure
  #   return true if self["date_closure"].nil? || self["date_closure"] >= self["registration_date"]
  #   errors.add(:date_closure, I18n.t("errors.models.child.date_closure"))
  #   error_with_section(:date_closure, I18n.t("errors.models.child.date_closure"))
  # end

  def to_s
    if self['name'].present?
      "#{self['name']} (#{self['unique_identifier']})"
    else
      self['unique_identifier']
    end
  end


  #TODO: Keep this?
  def self.search_field
    "name"
  end

  def self.view_by_field_list
    ['created_at', 'name', 'flag_at', 'reunited_at']
  end

  def self.get_case_id(child_id)
    case_id=""
    by_ids_and_revs.key(child_id).all.each do |cs|
      case_id = cs.case_id
    end
    return case_id
  end

  def self.get_case_age_and_gender(child_id)
    age, gender = nil, nil
    by_ids_and_revs.key(child_id).all.each do |cs|
      age = cs.age
      gender = cs.sex
    end
    return age, gender
  end

  def auto_populate_name
    #This 2 step process is necessary because you don't want to overwrite self.name if auto_populate is off
    a_name = auto_populate('name')
    self.name = a_name if a_name.present?
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

  def create_class_specific_fields(fields)
    #TODO - handle timezone adjustment  (See incident.date_of_first_report)
    self.registration_date ||= Date.today
  end

  def sortable_name
    self['name']
  end

  def has_one_interviewer?
    user_names_after_deletion = self['histories'].map { |change| change['user_name'] }
    user_names_after_deletion.delete(self['created_by'])
    self['last_updated_by'].blank? || user_names_after_deletion.blank?
  end

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
  def calculated_age
    if date_of_birth.present? && date_of_birth.is_a?(Date)
      now = Date.current
      now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
    end
  end

  def sync_protection_concerns
    protection_concerns = self.protection_concerns
    protection_concern_subforms = self.try(:protection_concern_detail_subform_section)
    if protection_concerns.present? && protection_concern_subforms.present?
      self.protection_concerns = (protection_concerns + protection_concern_subforms.map { |pc| pc.try(:protection_concern_type) }).compact.uniq
    end
  end

  #This method returns nil if object is nil
  def service_field_value(service_object, service_field)
    if service_object.present?
      service_object.try(service_field.to_sym)
    end
  end

  def matched_to_trace?(trace_id)
    self.matched_tracing_request_id.present? &&
    (self.matched_tracing_request_id.split('::').last == trace_id)
  end

  #TODO: The method is broken: the check should be for 'tracing_request'.
  #      Not fixing because find_match_tracing_requests is a shambles.
  def has_tracing_request?
    # TODO: this assumes if tracing-request is in associated_record_types then the tracing request forms are also present. Add check for tracing-request forms.
    self.module.present? && self.module.associated_record_types.include?('tracing-request')
  end

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

  alias :inherited_match_criteria :match_criteria
  def match_criteria(match_request=nil)
    match_criteria = inherited_match_criteria(match_request)
    Child.subform_matchable_fields.each do |field|
      match_criteria[:"#{field}"] = self.family.map{|member| member[:"#{field}"]}.compact.uniq.join(' ')
    end
    match_criteria.compact
  end

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

  def reopen(status, reopen_status, user_name)
    self.child_status = status
    self.case_status_reopened = reopen_status
    self.add_reopened_log(user_name)
  end

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

  def self.hidden_field_names
    ["name", "name_first", "name_middle", "name_last","name_other"]
  end

  def send_approval_response_mail(manager_id, approval_type, approval, host_url, is_gbv = false)
    ApprovalResponseJob.perform_later(manager_id, self.id, approval_type, approval, host_url, is_gbv)
  end

  #Override method in record concern
  def display_id
    case_id_display
  end

end
