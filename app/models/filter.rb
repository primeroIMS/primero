# frozen_string_literal: true

# The value bag representing the list view filters, and the hardcoded set of these filters in Primero
class Filter < ValueObject
  attr_accessor :name, :field_name, :type, :options, :option_strings_source

  FLAGGED_CASE = Filter.new(
    name: 'cases.filter_by.flag',
    field_name: 'flagged',
    options: I18n.available_locales.map do |locale|
      { locale => [{ id: 'true', display_name: I18n.t('cases.filter_by.flag_label', locale: locale) }] }
    end.inject(&:merge)
  )
  MOBILE_CASE = Filter.new(
    name: 'cases.filter_by.mobile',
    field_name: 'marked_for_mobile',
    options: I18n.available_locales.map do |locale|
      { locale => [{ id: 'true', display_name: I18n.t('cases.filter_by.mobile_label', locale: locale) }] }
    end.inject(&:merge)
  )
  SOCIAL_WORKER = Filter.new(name: 'cases.filter_by.social_worker', field_name: 'owned_by')
  MY_CASES = Filter.new(name: 'cases.filter_by.my_cases', field_name: 'my_cases')
  WORKFLOW = Filter.new(name: 'cases.filter_by.workflow', field_name: 'workflow')
  DATE_CASE = Filter.new(
    name: 'cases.filter_by.by_date',
    field_name: 'cases_by_date',
    type: 'dates'
  )
  APPROVALS_STATUS_ASSESSMENT = Filter.new(name: 'approvals.assessment', field_name: 'approval_status_assessment')
  APPROVALS_STATUS_CASE_PLAN = Filter.new(name: 'approvals.case_plan', field_name: 'approval_status_case_plan')
  APPROVALS_STATUS_CLOSURE = Filter.new(name: 'approvals.closure', field_name: 'approval_status_closure')
  APPROVALS_STATUS_ACTION_PLAN = Filter.new(name: 'approvals.action_plan', field_name: 'approval_status_action_plan')
  APPROVALS_STATUS_GBV_CLOSURE = Filter.new(name: 'approvals.gbv_closure', field_name: 'approval_status_gbv_closure')
  AGENCY =  Filter.new(name: 'cases.filter_by.agency', field_name: 'owned_by_agency_id', type: 'checkbox')
  STATUS =  Filter.new(
    name: 'cases.filter_by.status',
    field_name: 'status',
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
    option_strings_source: 'Location',
    type: 'multi_select'
  )
  AGENCY_OFFICE = Filter.new(
    name: 'user.agency_office',
    field_name: 'owned_by_agency_office',
    option_strings_source: 'lookup-agency-office'
  )
  USER_GROUP = Filter.new(name: 'permissions.permission.user_group', field_name: 'owned_by_groups')
  REPORTING_LOCATION = lambda do |params|
    Filter.new(
      name: "location.base_types.#{params[:labels]&.first}",
      field_name: "#{params[:field]}#{params[:admin_level]}",
      option_strings_source: 'ReportingLocation',
      type: 'multi_select'
    )
  end
  NO_ACTIVITY = Filter.new(
    name: 'cases.filter_by.no_activity',
    field_name: 'last_updated_at'
  )
  ENABLED = Filter.new(
    name: 'cases.filter_by.enabled_disabled',
    field_name: 'record_state',
    options: I18n.available_locales.map do |locale|
      {
        locale => [
          { id: 'true', display_name: I18n.t('disabled.status.enabled', locale: locale) },
          { id: 'false', display_name: I18n.t('disabled.status.disabled', locale: locale) }
        ]
      }
    end.inject(&:merge)
  )
  PHOTO = Filter.new(
    name: 'cases.filter_by.photo',
    field_name: 'has_photo',
    options: I18n.available_locales.map do |locale|
      {
        locale => [
          { id: 'photo', display_name: I18n.t('cases.filter_by.photo_label', locale: locale) }
        ]
      }
    end.inject(&:merge)
  )
  VIOLENCE_TYPE = Filter.new(
    name: 'incidents.filter_by.violence_type',
    field_name: 'gbv_sexual_violence_type',
    option_strings_source: 'lookup-gbv-sexual-violence-type'
  )
  CHILDREN = Filter.new(
    name: 'incidents.filter_by.children',
    field_name: 'child_types',
    options: I18n.available_locales.map do |locale|
      {
        locale => [
          { id: 'boys', display_name: I18n.t('incidents.filter_by.boys', locale: locale) },
          { id: 'girls', display_name: I18n.t('incidents.filter_by.girls', locale: locale) },
          { id: 'unknown', display_name: I18n.t('incidents.filter_by.unknown', locale: locale) }
        ]
      }
    end.inject(&:merge)
  )
  VERIFICATION_STATUS = Filter.new(
    name: 'incidents.filter_by.verification_status',
    field_name: 'verification_status',
    option_strings_source: 'lookup-incident-status'
  )
  INCIDENT_LOCATION = Filter.new(
    name: 'incidents.filter_by.incident_location',
    field_name: 'incident_location',
    option_strings_source: 'Location',
    type: 'multi_select'
  )
  INCIDENT_DATE = Filter.new(
    name: 'incidents.filter_by.by_date',
    field_name: 'incidents_by_date',
    type: 'dates'
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
  TRACING_REQUEST_STATUS = Filter.new(
    name: 'tracing_requests.filter_by.status',
    field_name: 'status',
    option_strings_source: 'lookup-inquiry-status'
  )
  SEPARATION_LOCATION = Filter.new(
    name: 'tracing_requests.filter_by.location_separation',
    field_name: 'location_separation',
    option_strings_source: 'Location',
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
    options: I18n.available_locales.map do |locale|
      {
        locale => [
          {
            id: 'inquiry_date',
            display_name: I18n.t('tracing_requests.selectable_date_options.inquiry_date', locale: locale)
          }
        ]
      }
    end.inject(&:merge)
  )
  CASE_FILTER_FIELD_NAMES = %w[
    gbv_displacement_status protection_status urgent_protection_concern
    protection_concerns type_of_risk
  ].freeze

  class << self
    def filters(user, record_type)
      filters = case record_type
                when 'case' then case_filters(user)
                when 'incident' then incident_filters(user)
                when 'tracing_request' then tracing_request_filter(user)
                end
      filters.map do |filter|
        hydrate_filter(filter, user, record_type)
      end
    end

    def hydrate_filter(filter, user, record_type)
      value = filter.clone
      value.with_options_for(user, record_type)
      value.resolve_type
      value
    end

    def case_filters(user)
      filter_fields = Field.where(name: CASE_FILTER_FIELD_NAMES).map { |f| [f.name, f] }.to_h
      role = user&.role
      reporting_location_config = role&.reporting_location_config ||
                                  SystemSettings.current.reporting_location_config
      reporting_location_field = reporting_location_config&.field_key || ReportingLocation::DEFAULT_FIELD_KEY
      reporting_location_labels = reporting_location_config&.label_keys
      reporting_location_admin_level = reporting_location_config&.admin_level
      permitted_form_ids = role.permitted_forms('case', true, false).pluck(:unique_id)

      filters = []
      filters << FLAGGED_CASE
      filters << SOCIAL_WORKER if user.manager?
      filters << MY_CASES
      filters << WORKFLOW
      filters << AGENCY if user.admin?
      filters << STATUS
      filters << AGE_RANGE
      filters << SEX
      filters << APPROVALS_STATUS_ASSESSMENT if user.can_approve_assessment?
      filters << APPROVALS_STATUS_CASE_PLAN if user.can_approve_case_plan?
      filters << APPROVALS_STATUS_CLOSURE if user.can_approve_closure?
      filters << APPROVALS_STATUS_ACTION_PLAN if user.can_approve_action_plan?
      filters << APPROVALS_STATUS_GBV_CLOSURE if user.can_approve_gbv_closure?
      if user.can?(:view_protection_concerns_filter, Child) && visible?('protection_concerns', filter_fields)
        filters << PROTECTION_CONCERNS
      end
      if user.module?(PrimeroModule::GBV) && visible?('gbv_displacement_status', filter_fields)
        filters << GBV_DISPLACEMENT_STATUS
      end
      filters << PROTECTION_STATUS if visible?('protection_status', filter_fields) && user.module?(PrimeroModule::CP)
      if user.module?(PrimeroModule::CP) && visible?('urgent_protection_concern', filter_fields)
        filters << URGENT_PROTECTION_CONCERN
      end
      filters << TYPE_OF_RISK if user.module?(PrimeroModule::CP) && visible?('type_of_risk', filter_fields)
      filters << RISK_LEVEL if user.module?(PrimeroModule::CP)
      filters << CURRENT_LOCATION if user.module?(PrimeroModule::CP)
      filters << AGENCY_OFFICE if user.module?(PrimeroModule::GBV)
      filters << USER_GROUP if user.module?(PrimeroModule::GBV) && user.user_group_filter?
      if user.module?(PrimeroModule::CP)
        filters << REPORTING_LOCATION.call(labels: reporting_location_labels, field: reporting_location_field,
                                           admin_level: reporting_location_admin_level)
      end
      filters << NO_ACTIVITY
      filters << DATE_CASE if user.module?(PrimeroModule::CP)
      filters << ENABLED
      filters << PHOTO if permitted_form_ids.include?('photos_and_audio') && user.module?(PrimeroModule::CP)
      filters
    end

    def incident_filters(user)
      filters = []
      filters << FLAGGED_CASE
      filters << VIOLENCE_TYPE if user.module?(PrimeroModule::GBV)
      filters << SOCIAL_WORKER if user.manager?
      filters << AGENCY_OFFICE if user.module?(PrimeroModule::GBV)
      filters << USER_GROUP if user.module?(PrimeroModule::GBV) && user.user_group_filter?
      filters << STATUS
      filters << AGE_RANGE
      filters << CHILDREN if user.module?(PrimeroModule::MRM)
      filters << VERIFICATION_STATUS if user.module?(PrimeroModule::MRM)
      filters << INCIDENT_LOCATION
      filters << INCIDENT_DATE
      filters << UNACCOMPANIED_PROTECTION_STATUS if user.module?(PrimeroModule::GBV)
      filters << ARMED_FORCE_GROUP if user.module?(PrimeroModule::MRM)
      filters << ARMED_FORCE_GROUP_TYPE if user.module?(PrimeroModule::MRM)
      filters << ENABLED
      filters
    end

    def tracing_request_filter(user)
      filters = []
      filters << FLAGGED_CASE
      filters << SOCIAL_WORKER if user.manager?
      filters << INQUIRY_DATE
      filters << TRACING_REQUEST_STATUS
      filters << SEPARATION_LOCATION
      filters << SEPARATION_CAUSE
      filters << ENABLED
      filters
    end

    private

    def visible?(field_name, filter_fields)
      field = filter_fields[field_name]
      field.present? && field.visible?
    end
  end

  def initialize(args = {})
    super(args)
  end

  def owned_by_options(opts = {})
    managed_user_names = opts[:user].managed_user_names
    self.options = managed_user_names.map { |user_name| { id: user_name, display_name: user_name } }
  end

  def workflow_options(opts = {})
    user_modules = opts[:user].modules_for_record_type(opts[:record_type])
    self.options = Child.workflow_statuses(user_modules)
  end

  def owned_by_agency_id_options(opts = {})
    managed_user_names = opts[:user].managed_user_names
    agencies = User.agencies_for_user_names(managed_user_names).where(disabled: false)
    self.options = I18n.available_locales.map do |locale|
      locale_options = agencies.map do |agency|
        { id: agency.unique_id, display_name: agency.name(locale) }
      end
      { locale => locale_options }
    end.inject(&:merge)
  end

  def age_options(_opts = {})
    system_settings = SystemSettings.current
    self.options = system_settings.age_ranges[system_settings.primary_age_range].map do |age_range|
      { id: age_range.to_s, display_name: age_range.to_s }
    end
  end

  def owned_by_groups_options(_opts = {})
    enabled_user_groups = UserGroup.where(disabled: false).map do |user_group|
      { id: user_group.unique_id, display_name: user_group.name }
    end

    self.options = I18n.available_locales.map do |locale|
      { locale => enabled_user_groups }
    end.inject(&:merge)
  end

  def cases_by_date_options(opts = {})
    self.options = I18n.available_locales.map do |locale|
      locale_options = [
        {
          id: 'registration_date',
          display_name: I18n.t('children.selectable_date_options.registration_date', locale: locale)
        },
        {
          id: 'assessment_requested_on',
          display_name: I18n.t('children.selectable_date_options.assessment_requested_on', locale: locale)
        },
        {
          id: 'date_case_plan',
          display_name: I18n.t('children.selectable_date_options.date_case_plan_initiated', locale: locale)
        },
        {
          id: 'date_closure',
          display_name: I18n.t('children.selectable_date_options.closure_approved_date', locale: locale)
        }
      ]
      date_label = opts[:user].module?(PrimeroModule::GBV) ? 'created_at' : 'date_of_creation'
      locale_options << { id: 'created_at',
                          display_name: I18n.t("children.selectable_date_options.#{date_label}", locale: locale) }
      { locale => locale_options }
    end.inject(&:merge)
  end

  def incidents_by_date_options(opts = {})
    self.options = I18n.available_locales.map do |locale|
      locale_options = []
      if opts[:user].module?(PrimeroModule::GBV)
        locale_options << {
          id: 'date_of_first_report',
          display_name: I18n.t('incidents.selectable_date_options.date_of_first_report', locale: locale)
        }
      end
      locale_options << {
        id: 'incident_date_derived',
        display_name: I18n.t('incidents.selectable_date_options.incident_date_derived', locale: locale)
      }
      { locale => locale_options }
    end.inject(&:merge)
  end

  def approval_status_options
    self.options = I18n.available_locales.map do |locale|
      {
        locale => [
          Approval::APPROVAL_STATUS_PENDING, Approval::APPROVAL_STATUS_APPROVED,
          Approval::APPROVAL_STATUS_REJECTED
        ].map do |status|
          { id: status, display_name: I18n.t("cases.filter_by.approvals.#{status}", locale: locale) }
        end
      }
    end.inject(&:merge)
  end

  def with_options_for(user, record_type)
    if %w[approval_status_assessment approval_status_case_plan approval_status_closure
          approval_status_action_plan approval_status_gbv_closure].include? field_name
      approval_status_options
    elsif %w[owned_by workflow owned_by_agency_id age owned_by_groups cases_by_date incidents_by_date].include? field_name
      opts = { user: user, record_type: record_type }
      send("#{field_name}_options", opts)
    end
  end

  def resolve_type
    return if type.present?

    if options.blank?
      self.type = 'checkbox'
      return
    end

    options_length = options.is_a?(Array) ? options.length : options[I18n.default_locale].length
    case options_length
    when 1
      self.type = 'toggle'
    when 2, 3
      self.type = 'multi_toggle'
    else
      self.type = 'checkbox'
    end
  end

  def inspect
    "Filter(name: #{name}, field_name: #{field_name}, type: #{type})"
  end
end
