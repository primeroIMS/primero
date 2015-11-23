class Child < CouchRest::Model::Base
  use_database :child

  CHILD_PREFERENCE_MAX = 3

  def self.parent_form
    'case'
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

  include Ownable
  include AudioUploader

  property :case_id
  property :case_id_code
  property :case_id_display
  property :nickname
  property :name
  property :hidden_name, TrueClass, :default => false
  property :registration_date, Date
  property :reunited, TrueClass
  property :reunited_message, String
  property :investigated, TrueClass
  property :verified, TrueClass
  property :risk_level
  property :child_status
  property :system_generated_followup, TrueClass, default: false
  property :registration_date, Date
  #To hold the list of GBV Incidents created from a GBV Case.
  property :incident_links, [String], :default => []

  # validate :validate_has_at_least_one_field_value
  validate :validate_date_of_birth
  validate :validate_child_wishes
  # validate :validate_date_closure

  def initialize *args
    self['photo_keys'] ||= []
    self['document_keys'] ||= []
    arguments = args.first

    if arguments.is_a?(Hash) && arguments["current_photo_key"]
      self['current_photo_key'] = arguments["current_photo_key"]
      arguments.delete("current_photo_key")
    end

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
    [
      'unique_identifier', 'short_id', 'name', 'name_nickname', 'name_other',
      'ration_card_no', 'icrc_ref_no', 'rc_id_no', 'unhcr_id_no', 'un_no', 'other_agency_id'
    ]
  end
  include Searchable #Needs to be after ownable, quicksearch fields
  include Flaggable
  include Transitionable

  searchable do
    string :fathers_name do
      self.fathers_name
    end

    string :mothers_name do
      self.mothers_name
    end

    string :case_id_display do
      self.case_id_display
    end

    boolean :estimated
    boolean :consent_for_services
  end

  def self.minimum_reportable_fields
    {
          'boolean' => ['record_state'],
           'string' => ['child_status', 'sex', 'risk_level', 'owned_by_agency', 'owned_by_location_district', 'owned_by'],
      'multistring' => ['associated_user_names'],
             'date' => ['registration_date'],
          'integer' => ['age'],
         'location' => ['owned_by_location', 'location_current']
    }
  end

  def self.nested_reportable_types
    [ReportableProtectionConcern, ReportableService, ReportableFollowUp]
  end

  def self.fetch_all_ids_and_revs
    ids_and_revs = []
    all_rows = self.by_ids_and_revs({:include_docs => false})["rows"]
    all_rows.each do |row|
      ids_and_revs << row["value"]
    end
    ids_and_revs
  end

  def self.by_date_of_birth_range(startDate, endDate)
    if startDate.is_a?(Date) && endDate.is_a?(Date)
      self.by_date_of_birth_month_day(:startkey => [startDate.month, startDate.day], :endkey => [endDate.month, endDate.day]).all
    end
  end

  def validate_has_at_least_one_field_value
    return true if field_definitions.any? { |field| is_filled_in?(field) }
    return true if !@file_name.nil? || !@audio_file_name.nil?
    return true if deprecated_fields && deprecated_fields.any? { |key, value| !value.nil? && value != [] && value != {} && !value.to_s.empty? }
    errors.add(:validate_has_at_least_one_field_value, I18n.t("errors.models.child.at_least_one_field"))
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

  def set_instance_id
    system_settings = SystemSettings.current
    self.case_id ||= self.unique_identifier
    self.case_id_code ||= create_case_id_code(system_settings)
    self.case_id_display ||= create_case_id_display(system_settings)
  end

  def create_case_id_code(system_settings)
    separator = (system_settings.present? && system_settings.case_code_separator.present? ? system_settings.case_code_separator : '')
    id_code_parts = []
    if system_settings.present? && system_settings.case_code_format.present?
      system_settings.case_code_format.each {|cf| id_code_parts << PropertyEvaluator.evaluate(self, cf)}
    end
    id_code_parts.reject(&:blank?).join(separator)
  end

  def create_case_id_display(system_settings)
    separator = (system_settings.present? && system_settings.case_code_separator.present? ? system_settings.case_code_separator : '')
    [self.case_id_code, self.short_id].reject(&:blank?).join(separator)
  end

  def create_class_specific_fields(fields)
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

  def fathers_name
    self.family_details_section.select{|fd| fd.relation.try(:downcase) == 'father'}.first.try(:relation_name) if self.family_details_section.present?
  end

  def mothers_name
    self.family_details_section.select{|fd| fd.relation.try(:downcase) == 'mother'}.first.try(:relation_name) if self.family_details_section.present?
  end

  def caregivers_name
    self.name_caregiver || self.family_details_section.select {|fd| fd.relation_is_caregiver == 'Yes' }.first.try(:relation_name) if self.family_details_section.present?
  end

  # Solution below taken from...
  # http://stackoverflow.com/questions/819263/get-persons-age-in-ruby
  def calculated_age
    if date_of_birth.present? && date_of_birth.is_a?(Date)
      now = Date.current
      now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
    end
  end

  private

  def deprecated_fields
    system_fields = ["created_at",
                     "last_updated_at",
                     "last_updated_by",
                     "last_updated_by_full_name",
                     "posted_at",
                     "posted_from",
                     "_rev",
                     "_id",
                     "short_id",
                     "created_by",
                     "created_by_full_name",
                     "couchrest-type",
                     "histories",
                     "unique_identifier",
                     "current_photo_key",
                     "created_organization",
                     "photo_keys"]
    existing_fields = system_fields + field_definitions.map { |x| x.name }
    self.reject { |k, v| existing_fields.include? k }
  end

end
