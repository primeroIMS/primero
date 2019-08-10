class Filter < ValueObject
  attr_accessor :name, :field_name, :type, :options, :option_strings_source

  @primero_module_cp = PrimeroModule.cp
  @primero_module_gbv = PrimeroModule.gbv
  @primero_module_mrm = PrimeroModule.mrm

  FLAGGED_CASE = Filter.new(
    name: 'cases.filter_by.flag',
    field_name: 'flagged',
    options: [{ id: 'true', display_name: FieldI18nService.all_values_for("cases.filter_by.flag_label") }]
  )
  MOBILE_CASE = Filter.new(
    name: 'cases.filter_by.mobile',
    field_name: "marked_for_mobile",
    options: [{ id: 'true', display_name: FieldI18nService.all_values_for("cases.filter_by.mobile_label") }]
  )
  SOCIAL_WORKER = Filter.new(name: 'cases.filter_by.social_worker', field_name: 'owned_by')
  MY_CASES = Filter.new(name: 'cases.filter_by.my_cases', field_name: 'my_cases')
  WORKFLOW = Filter.new(name: 'cases.filter_by.workflow', field_name: 'workflow')
  DATE_CASE = Filter.new(
    name: 'cases.filter_by.by_date',
    field_name: 'cases_by_date',
    type: 'dates'
  )
  # TODO: There are different fields for approvals I need to create each one by status,
  # similar to what happens for my_cases.
  # APPROVALS = []
  AGENCY =  Filter.new(name: 'cases.filter_by.agency', field_name: 'owned_by_agency')
  STATUS =  Filter.new(
    name: 'cases.filter_by.status',
    field_name: 'child_status',
    option_strings_source: 'lookup-case-status'
  )
  AGE_RANGE = Filter.new(
    name: 'cases.filter_by.age_range',
    field_name: 'age',
    type: 'multi_toggle'
  )
  SEX = Filter.new(
    name: 'cases.filter_by.sex',
    field_name: 'sex',
    option_strings_source: 'lookup-gender'
  )
  PROTECTION_CONCERNS = Filter.new(
    name: 'cases.filter_by.protection_concerns',
    field_name: 'protection_concerns',
    option_strings_source: 'lookup-protection-concerns'
  )
  GBV_DISPLACEMENT_STATUS = Filter.new(
    name: 'cases.filter_by.displacement_status',
    field_name: 'gbv_displacement_status',
    option_strings_source: 'lookup-displacement-status'
  )
  PROTECTION_STATUS = Filter.new(
    name: 'cases.filter_by.protection_status',
    field_name: 'protection_status',
    option_strings_source: 'lookup-protection-status'
  )
  URGENT_PROTECTION_CONCERN = Filter.new(
    name: 'cases.filter_by.urgent_protection_concern',
    field_name: 'urgent_protection_concern',
    option_strings_source: 'lookup-yes-no'
  )
  TYPE_OF_RISK = Filter.new(
    name: 'cases.filter_by.type_of_risk',
    field_name: 'type_of_risk',
    option_strings_source: 'lookup-risk-type'
  )
  RISK_LEVEL = Filter.new(
    name: 'cases.filter_by.risk_level',
    field_name: 'risk_level',
    option_strings_source: 'lookup-risk-level',
    type: 'chips'
  )
  CURRENT_LOCATION = Filter.new(
    name: 'cases.filter_by.current_location', 
    field_name: 'location_current',
    option_strings_source: 'location',
    type: 'multi_select'
  )
  AGENCY_OFFICE = Filter.new(
    name: 'user.agency_office',
    field_name: 'created_agency_office',
    option_strings_source: 'lookup-agency-office'
  )
  USER_GROUP = Filter.new(name: 'permissions.permission.user_group', field_name: 'owned_by_groups')
  REPORTING_LOCATION = -> (label, admin_level) { 
    Filter.new(
      name: "location.base_types.#{label}", 
      field_name: "#{admin_level}",
      option_strings_source: 'reporting_location',
      type: 'multi_select',
      
    ) 
  }
  RECORD_STATE = Filter.new(
    name: 'cases.filter_by.record_state',
    field_name: 'record_state',
    options: [ 
      { id: 'true', display_text: FieldI18nService.all_values_for("valid") },
      { id: 'false', display_text: FieldI18nService.all_values_for("invalid") }
    ]
  )
  PHOTO = Filter.new(
    name: 'cases.filter_by.photo',
    field_name: 'has_photo',
    options: [
      { id: 'photo', display_text: FieldI18nService.all_values_for("cases.filter_by.photo_label") }
    ]
  )
  # TODO: This field requires values from the concern IncidentMonitoringRecording which apparently will not be migrated.
  # VIOLATION = Filter.new(name: 'incidents.filter_by.violation', field_name: 'violations')
  VIOLENCE_TYPE = Filter.new(
    name: 'incidents.filter_by.violence_type',
    field_name: 'gbv_sexual_violence_type',
    option_strings_source: 'lookup-gbv-sexual-violence-type'
  )
  CHILDREN = Filter.new(
    name: 'incidents.filter_by.children',
    field_name: 'child_types',
    options: [
      { id: 'boys', display_text: FieldI18nService.all_values_for("incidents.filter_by.boys") },
      { id: 'girls', display_text: FieldI18nService.all_values_for("incidents.filter_by.girls") },
      { id: 'unknown', display_text: FieldI18nService.all_values_for("incidents.filter_by.unknown") }
    ]
  )
  VERIFICATION_STATUS = Filter.new(
    name: 'incidents.filter_by.verification_status',
    field_name: 'verification_status',
    option_strings_source: 'lookup-incident-status'
  )
  INCIDENT_LOCATION = Filter.new(
    name: 'incidents.filter_by.incident_location',
    field_name: 'incident_location',
    option_strings_source: 'location',
    type: 'multi_select'
  )
  INCIDENT_DATE = Filter.new(
    name: 'incidents.filter_by.by_date',
    field_name: 'incidents_by_date',
    type: 'dates',
  )
  UNACCOMPANIED_PROTECTION_STATUS = Filter.new(
    name: 'incidents.filter_by.unaccompanied_separated_status',
    field_name: 'unaccompanied_separated_status',
    option_strings_source: 'lookup-unaccompanied-separated-status'

  )
  ARMED_FORCE_GROUP = Filter.new(
    name: 'incidents.filter_by.armed_force_group_name',
    field_name: 'armed_force_group_names',
    option_strings_source: 'lookup-armed-force-group-name'
  )
  ARMED_FORCE_GROUP_TYPE = Filter.new(
    name: 'incidents.filter_by.armed_force_group_type',
    field_name: 'perpetrator_sub_categories',
    option_strings_source: 'lookup-armed-force-group-type'
  )
  INQUIRY_STATUS = Filter.new(
    name: 'tracing_requests.filter_by.inquiry_status',
    field_name: 'inquiry_status',
    option_strings_source: 'lookup-inquiry-status'
  )
  SEPARATION_LOCATION = Filter.new(
    name: 'tracing_requests.filter_by.location_separation',
    field_name: 'location_separation',
    option_strings_source: 'location',
    type: 'multi_select'
  )
  SEPARATION_CAUSE = Filter.new(
    name: 'tracing_requests.filter_by.separation_cause',
    field_name: 'separation_cause',
    option_strings_source: 'lookup-separation-cause'
  )
  INQUIRY_DATE = Filter.new(
    name: 'tracing_requests.filter_by.by_date',
    field_name: 'inquiry_date',
    options: [
      { id: 'inquiry_date' , display_name: FieldI18nService.all_values_for('tracing_requests.selectable_date_options.inquiry_date') }
    ]
  )

  FILTER_FIELD_NAMES = %w(
    gbv_displacement_status protection_status urgent_protection_concern
    protection_concerns type_of_risk
  )

  class << self
    def get_filters(user, record_type, lookups = nil, locations = nil, reporting_locations = nil, sys = nil)
      model_class = Record.model_from_name(record_type)
      filters = case record_type
                  when 'case'
                    @filter_fields = Field.get_by_name(FILTER_FIELD_NAMES).map{|f| [f.name, f]}.to_h
                    case_filters(user, model_class, sys)
                  when 'incident' then incident_filters(user, model_class)
                  when 'tracing_request' then tracing_request_filter(user)
                end
      filters.each do |filter| 
        filter.with_options_for(user, record_type, lookups, locations, reporting_locations, sys) 
        filter.resolve_type
      end
    end

    def visible_filter_field?(field_name)
      field = @filter_fields[field_name]
      field.present? && field.visible?
    end

    def case_filters(user, model_class, sys)
      reporting_location_label = sys.reporting_location_config.label_key || ReportingLocation::DEFAULT_LABEL_KEY
      admin_level = sys.reporting_location_config.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL

      filters = []
      filters << FLAGGED_CASE
      filters << MOBILE_CASE if user.can?(:sync_mobile, model_class)
      filters << SOCIAL_WORKER if user.is_manager?
      filters << MY_CASES
      filters << WORKFLOW
      filters << AGENCY if user.admin?
      filters << STATUS
      filters << AGE_RANGE
      filters << SEX
      # TODO: Approvals field
      filters << PROTECTION_CONCERNS if user.can?(:view_protection_concerns_filter, model_class) && visible_filter_field?('protection_concerns')
      filters << GBV_DISPLACEMENT_STATUS if user.has_module?(@primero_module_gbv.id) && visible_filter_field?('gbv_displacement_status')
      filters << PROTECTION_STATUS if visible_filter_field?('protection_status')
      filters << URGENT_PROTECTION_CONCERN if user.has_module?(@primero_module_cp.id) && visible_filter_field?('urgent_protection_concern')
      filters << TYPE_OF_RISK if user.has_module?(@primero_module_cp.id) && visible_filter_field?("type_of_risk")
      filters << RISK_LEVEL if user.has_module?(@primero_module_cp.id)
      filters << CURRENT_LOCATION if user.has_module?(@primero_module_cp.id)
      filters << AGENCY_OFFICE if user.has_module?(@primero_module_gbv.id)
      filters << USER_GROUP if user.has_module?(@primero_module_gbv.id) && user.has_user_group_filter?
      filters << REPORTING_LOCATION.call(reporting_location_label, admin_level)
      filters << DATE_CASE if user.has_module?(@primero_module_cp.id)
      # TODO: CASE_OPEN_DATE filter is not used.
      filters << PHOTO if user.has_module?(@primero_module_cp.id) && FormSection.has_photo_form
      filters
    end

    def incident_filters(user, model_class)
      filters = []
      filters << FLAGGED_CASE
      filters << MOBILE_CASE if user.can?(:sync_mobile, model_class)
      # SEE TODO IN FILTER
      # filters << VIOLATION if user.has_module?(PrimeroModule::MRM)
      filters << VIOLENCE_TYPE if user.has_module?(@primero_module_gbv.id)
      filters << SOCIAL_WORKER if user.is_manager?
      filters << AGENCY_OFFICE if user.has_module?(@primero_module_gbv.id)
      filters << USER_GROUP if user.has_module?(@primero_module_gbv.id) && user.has_user_group_filter?
      filters << STATUS
      filters << AGE_RANGE
      filters << CHILDREN if @primero_module_mrm.present? &&  user.has_module?(@primero_module_mrm.id)
      filters << VERIFICATION_STATUS if  @primero_module_mrm.present? && user.has_module?(@primero_module_mrm.id)
      filters << INCIDENT_LOCATION
      filters << INCIDENT_DATE
      filters << UNACCOMPANIED_PROTECTION_STATUS if user.has_module?(@primero_module_gbv.id)
      filters << ARMED_FORCE_GROUP if @primero_module_mrm.present? && user.has_module?(@primero_module_mrm.id)
      filters << ARMED_FORCE_GROUP_TYPE if @primero_module_mrm.present? && user.has_module?(@primero_module_mrm.id)
      filters << RECORD_STATE
      filters 
    end

    def tracing_request_filter(user)
      filters = []
      filters << FLAGGED_CASE
      filters << SOCIAL_WORKER if user.is_manager?
      filters << INQUIRY_DATE
      filters << INQUIRY_STATUS
      filters << SEPARATION_LOCATION
      filters << SEPARATION_CAUSE
      #TODO: This is also commented in Tracing Request filters
      #filters << SEX
      #filters << AGE_RANGE
      filters << RECORD_STATE
      filters
    end

    private

    def visible_filter_field?(field_name)
      field = @filter_fields[field_name]
      field.present? && field.visible?
    end
  end

  def initialize(args={})
    super(args)
  end

  def with_options_for(user, record_type = nil, lookups = nil, locations = nil, reporting_locations = nil, system_settings = nil)
    if self.option_strings_source.present?
      if self.option_strings_source == 'location'
        self.options = locations
      elsif self.option_strings_source == 'reporting_location'
        self.options = reporting_locations
      else
        self.options = I18n.available_locales.map do |locale|
          { locale => [] } 
        end.inject(&:merge).merge(Lookup.all_values(self.option_strings_source, lookups))
      end
    else
      managed_user_names = user.managed_user_names
      user_modules = user.modules_for_record_type(record_type)
      # TODO: I18n all the display_name
      case self.field_name
        when 'owned_by'
          self.options = managed_user_names.map do |user_name|
            { id: user_name, display_name: user_name } 
          end
        when 'workflow'
          self.options = Child.workflow_statuses(user_modules)
        when 'owned_by_agency'
          self.options = User.agencies_by_user_list(managed_user_names).map do |agency| 
            { id: agency.id, display_name: agency.name }
          end
        when 'age'
          self.options = system_settings.age_ranges[system_settings.primary_age_range].map do |age_range|
            { id: age_range.to_s, display_text: age_range.to_s }
          end
        when 'owned_by_groups'
          self.options =  UserGroup.all do |user_group| 
            { id: user_group.id, display_text: user_group.name } 
          end
        when 'cases_by_date'
          self.options = [
            { id: 'registration_date', display_name: FieldI18nService.all_values_for('children.selectable_date_options.registration_date') },
            { id: 'assessment_requested_on', display_name: FieldI18nService.all_values_for('children.selectable_date_options.assessment_requested_on') },
            { id: 'date_case_plan', display_name: FieldI18nService.all_values_for('children.selectable_date_options.date_case_plan_initiated') },
            { id: 'date_closure', display_name: FieldI18nService.all_values_for('children.selectable_date_options.closure_approved_date') },
          ]
          self.options << { id: 'created_at', display_name: FieldI18nService.all_values_for('children.selectable_date_options.created_at') } if user.has_module?(PrimeroModule::GBV)
        when 'incidents_by_date'
          self.options = []
          self.options << { id: 'date_of_first_report', display_name: FieldI18nService.all_values_for('incidents.selectable_date_options.date_of_first_report') } if user.has_module?(PrimeroModule::GBV)
          self.options << { id: 'incident_date_derived', display_name: FieldI18nService.all_values_for('incidents.selectable_date_options.incident_date_derived') }
      end
    end
  end
  
  def resolve_type
    if self.type.blank? && self.options.present?
      if self.options.length == 1
        self.type = 'toggle'
      elsif self.options.length > 3
        self.type = 'checkbox'
      elsif self.options.length == 3 || self.options.length == 2
        self.type = 'multi_toggle'
      end
    end
  end

  def inspect
    "Filter(name: #{self.name}, field_name: #{self.field_name}, type: #{self.type})"
  end
end
