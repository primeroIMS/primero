# frozen_string_literal: true

# This represents the authorizations a user is entitled to
# Primero business objects by way of the role granted to the user.
# A permission is usually a pairing of the business object (case, incident, etc.)
# and the actions the user is entitled to perform on it (read, write, create).
# Some actions actually represent sub-resources. For example a user may be granted the ability to see dashboards,
# but each individual dashboard entitlement is treated as an action grant.
class Permission < ValueObject
  # The role_unique_ids property is used solely for the ROLE resource
  # It associates other roles with this ROLE permission
  # That restricts this role to only be able to manage those associated roles
  # If the role_unique_ids property is empty on a ROLE permission, then that allows this role to manage all other ROLES
  attr_accessor :resource, :actions, :role_unique_ids, :agency_unique_ids

  READ = 'read'
  WRITE = 'write'
  ENABLE_DISABLE_RECORD = 'enable_disable_record'
  FLAG = 'flag'
  IMPORT = 'import'
  EXPORT_LIST_VIEW = 'export_list_view_csv'
  EXPORT_CSV = 'export_csv'
  EXPORT_EXCEL = 'export_xls'
  EXPORT_JSON = 'export_json'
  EXPORT_PHOTO_WALL = 'export_photowall'
  EXPORT_UNHCR = 'export_unhcr_csv'
  EXPORT_DUPLICATE_ID = 'export_duplicate_id_csv'
  EXPORT_PDF = 'export_pdf'
  EXPORT_MRM_VIOLATION_XLS = 'export_mrm_violation_xls'
  EXPORT_INCIDENT_RECORDER = 'export_incident_recorder_xls'
  EXPORT_CUSTOM = 'export_custom'
  REFERRAL_FROM_SERVICE = 'referral_from_service'
  CASE = 'case'
  INCIDENT = 'incident'
  TRACING_REQUEST = 'tracing_request'
  POTENTIAL_MATCH = 'potential_match'
  DUPLICATE = 'duplicate'
  USER = 'user'
  USER_GROUP = 'user_group'
  ROLE = 'role'
  AGENCY = 'agency'
  WEBHOOK = 'webhook'
  METADATA = 'metadata'
  CONFIGURATION = 'primero_configuration'
  SYSTEM = 'system'
  REPORT = 'report'
  AUDIT_LOG = 'audit_log'
  MATCHING_CONFIGURATION = 'matching_configuration'
  SELF = 'self' # A redundant permission. This is implied.
  GROUP = 'group'
  ALL = 'all'
  CONSENT_OVERRIDE = 'consent_override'
  SYNC_MOBILE = 'sync_mobile'
  SYNC_EXTERNAL = 'sync_external'
  REQUEST_APPROVAL_ASSESSMENT = 'request_approval_assessment'
  REQUEST_APPROVAL_CASE_PLAN = 'request_approval_case_plan'
  REQUEST_APPROVAL_CLOSURE = 'request_approval_closure'
  REQUEST_APPROVAL_ACTION_PLAN = 'request_approval_action_plan'
  REQUEST_APPROVAL_GBV_CLOSURE = 'request_approval_gbv_closure'
  APPROVE_ASSESSMENT = 'approve_assessment'
  APPROVE_CASE_PLAN = 'approve_case_plan'
  APPROVE_CLOSURE = 'approve_closure'
  APPROVE_ACTION_PLAN = 'approve_action_plan'
  APPROVE_GBV_CLOSURE = 'approve_gbv_closure'
  COPY = 'copy'
  MANAGE = 'manage'
  GROUP_READ = 'group_read'
  DASHBOARD = 'dashboard'
  DASH_APPROVALS_ASSESSMENT = 'approvals_assessment'
  DASH_APPROVALS_ASSESSMENT_PENDING = 'approvals_assessment_pending'
  DASH_APPROVALS_CASE_PLAN = 'approvals_case_plan'
  DASH_APPROVALS_CASE_PLAN_PENDING = 'approvals_case_plan_pending'
  DASH_APPROVALS_CLOSURE = 'approvals_closure'
  DASH_APPROVALS_CLOSURE_PENDING = 'approvals_closure_pending'
  DASH_APPROVALS_ACTION_PLAN = 'approvals_action_plan'
  DASH_APPROVALS_ACTION_PLAN_PENDING = 'approvals_action_plan_pending'
  DASH_APPROVALS_GBV_CLOSURE = 'approvals_gbv_closure'
  DASH_APPROVALS_GBV_CLOSURE_PENDING = 'approvals_gbv_closure_pending'
  VIEW_RESPONSE = 'view_response'
  VIEW_PROTECTION_CONCERNS_FILTER = 'view_protection_concerns_filter'
  DASH_CASE_OVERVIEW = 'case_overview'
  DASH_CASE_RISK = 'case_risk'
  DASH_REPORTING_LOCATION = 'dash_reporting_location'
  DASH_PROTECTION_CONCERNS = 'dash_protection_concerns'
  DASH_SHARED_WITH_OTHERS = 'dash_shared_with_others'
  DASH_SERVICE_PROVISIONS = 'dash_service_provisions'
  DASH_MATCHING_RESULTS = 'dash_matching_results'
  DASH_CASES_BY_SOCIAL_WORKER = 'dash_cases_by_social_worker'
  DASH_WORKFLOW = 'workflow'
  DASH_WORKFLOW_TEAM = 'workflow_team'
  DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT = 'cases_by_task_overdue_assessment'
  DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN = 'cases_by_task_overdue_case_plan'
  DASH_CASES_BY_TASK_OVERDUE_SERVICES = 'cases_by_task_overdue_services'
  DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS = 'cases_by_task_overdue_followups'
  DASH_CASES_TO_ASSIGN = 'dash_cases_to_assign'
  DASH_SHOW_NONE_VALUES = 'dash_show_none_values'
  DASH_TASKS = 'dash_tasks'
  DASH_FLAGS = 'dash_flags'
  DASH_PROTECTION_CONCERNS_BY_LOCATION = 'dash_protection_concerns_by_location'
  DASH_SHARED_WITH_ME = 'dash_shared_with_me'
  DASH_GROUP_OVERVIEW = 'dash_group_overview'
  DASH_SHARED_FROM_MY_TEAM = 'dash_shared_from_my_team'
  DASH_SHARED_WITH_MY_TEAM = 'dash_shared_with_my_team'
  DASH_CASE_INCIDENT_OVERVIEW = 'dash_case_incident_overview'
  DASH_NATIONAL_ADMIN_SUMMARY = 'dash_national_admin_summary'
  SEARCH_OWNED_BY_OTHERS = 'search_owned_by_others'
  DISPLAY_VIEW_PAGE = 'display_view_page'
  REQUEST_TRANSFER = 'request_transfer'
  VIEW_PHOTO = 'view_photo'
  INCIDENT_FROM_CASE = 'incident_from_case'
  INCIDENT_DETAILS_FROM_CASE = 'incident_details_from_case'
  VIEW_INCIDENT_FROM_CASE = 'view_incident_from_case'
  SERVICES_SECTION_FROM_CASE = 'services_section_from_case'
  CREATE = 'create'
  ADMIN_ONLY = 'admin_only'
  AGENCY_READ = 'agency_read'
  REMOVE_ASSIGNED_USERS = 'remove_assigned_users'
  SERVICE_PROVISION_INCIDENT_DETAILS = 'service_provision_incident_details'
  ADD_NOTE = 'add_note'
  FIND_TRACING_MATCH = 'find_tracing_match'
  ASSIGN = 'assign'
  ASSIGN_WITHIN_AGENCY = 'assign_within_agency'
  ASSIGN_WITHIN_USER_GROUP = 'assign_within_user_group'
  TRANSFER = 'transfer'
  RECEIVE_TRANSFER = 'receive_transfer'
  REFERRAL = 'referral'
  RECEIVE_REFERRAL = 'receive_referral'
  RECEIVE_REFERRAL_DIFFERENT_MODULE = 'receive_referral_different_module'
  REOPEN = 'reopen'
  CLOSE = 'close'
  DELETE = 'delete'
  CHANGE_LOG = 'change_log'
  KPI = 'kpi'
  KPI_ASSESSMENT_STATUS = 'kpi_assessment_status'
  KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE = 'kpi_average_followup_meetings_per_case'
  KPI_AVERAGE_REFERRALS = 'kpi_average_referrals'
  KPI_CASE_CLOSURE_RATE = 'kpi_case_closure_rate'
  KPI_CASE_LOAD = 'kpi_case_load'
  KPI_CLIENT_SATISFACTION_RATE = 'kpi_client_satisfaction_rate'
  KPI_COMPLETED_CASE_ACTION_PLANS = 'kpi_completed_case_action_plans'
  KPI_COMPLETED_CASE_SAFETY_PLANS = 'kpi_completed_case_safety_plans'
  KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS = 'kpi_completed_supervisor_approved_case_action_plans'
  KPI_NUMBER_OF_CASES = 'kpi_number_of_cases'
  KPI_NUMBER_OF_INCIDENTS = 'kpi_number_of_incidents'
  KPI_REPORTING_DELAY = 'kpi_reporting_delay'
  KPI_SERVICES_PROVIDED = 'kpi_services_provided'
  KPI_SUPERVISOR_TO_CASEWORKER_RATIO = 'kpi_supervisor_to_caseworker_ratio'
  KPI_TIME_FROM_CASE_OPEN_TO_CLOSE = 'kpi_time_from_case_open_to_close'
  CODE_OF_CONDUCT = 'code_of_conduct'

  RESOURCE_ACTIONS = {
    CASE => [
      READ, CREATE, WRITE, ENABLE_DISABLE_RECORD, FLAG, INCIDENT_FROM_CASE, INCIDENT_DETAILS_FROM_CASE,
      VIEW_INCIDENT_FROM_CASE,
      SERVICE_PROVISION_INCIDENT_DETAILS, SERVICES_SECTION_FROM_CASE, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL,
      EXPORT_PHOTO_WALL, EXPORT_UNHCR, EXPORT_PDF, EXPORT_DUPLICATE_ID, EXPORT_JSON, EXPORT_CUSTOM, IMPORT,
      CONSENT_OVERRIDE, SYNC_EXTERNAL, SYNC_MOBILE, REQUEST_APPROVAL_ASSESSMENT, REQUEST_APPROVAL_CASE_PLAN,
      REQUEST_APPROVAL_CLOSURE, REQUEST_APPROVAL_ACTION_PLAN, REQUEST_APPROVAL_GBV_CLOSURE,
      APPROVE_ASSESSMENT, APPROVE_CASE_PLAN, APPROVE_CLOSURE, APPROVE_ACTION_PLAN, APPROVE_GBV_CLOSURE,
      SEARCH_OWNED_BY_OTHERS, DISPLAY_VIEW_PAGE, REQUEST_TRANSFER, VIEW_PHOTO, REFERRAL_FROM_SERVICE, ADD_NOTE,
      FIND_TRACING_MATCH, ASSIGN, ASSIGN_WITHIN_AGENCY, ASSIGN_WITHIN_USER_GROUP, REMOVE_ASSIGNED_USERS, TRANSFER,
      RECEIVE_TRANSFER, REFERRAL, RECEIVE_REFERRAL, RECEIVE_REFERRAL_DIFFERENT_MODULE, REOPEN, CLOSE,
      VIEW_PROTECTION_CONCERNS_FILTER, CHANGE_LOG, MANAGE
    ],
    INCIDENT => [
      READ, CREATE, WRITE, ENABLE_DISABLE_RECORD, FLAG, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL, EXPORT_PDF,
      EXPORT_INCIDENT_RECORDER, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, SYNC_MOBILE, CHANGE_LOG,
      MANAGE
    ],
    TRACING_REQUEST => [
      READ, CREATE, WRITE, ENABLE_DISABLE_RECORD, FLAG, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_PDF,
      EXPORT_JSON, EXPORT_CUSTOM, IMPORT, CHANGE_LOG, MANAGE
    ],
    ROLE => [CREATE, READ, WRITE, ASSIGN, COPY, MANAGE, DELETE],
    USER => [CREATE, READ, AGENCY_READ, WRITE, MANAGE],
    USER_GROUP => [CREATE, READ, WRITE, ASSIGN, MANAGE, DELETE],
    AGENCY => [READ, WRITE, ASSIGN, MANAGE],
    WEBHOOK => [CREATE, READ, WRITE, DELETE, MANAGE],
    REPORT => [READ, GROUP_READ, CREATE, WRITE, MANAGE],
    METADATA => [MANAGE],
    POTENTIAL_MATCH => [READ],
    DUPLICATE => [READ],
    SYSTEM => [MANAGE],
    CONFIGURATION => [MANAGE],
    DASHBOARD => [
      DASH_CASE_OVERVIEW, DASH_CASE_RISK, DASH_APPROVALS_ASSESSMENT, DASH_APPROVALS_ASSESSMENT_PENDING,
      DASH_APPROVALS_CASE_PLAN, DASH_APPROVALS_CASE_PLAN_PENDING, DASH_APPROVALS_CLOSURE,
      DASH_APPROVALS_CLOSURE_PENDING, DASH_APPROVALS_ACTION_PLAN, DASH_APPROVALS_ACTION_PLAN_PENDING,
      DASH_APPROVALS_GBV_CLOSURE, DASH_APPROVALS_GBV_CLOSURE_PENDING, VIEW_RESPONSE, DASH_REPORTING_LOCATION,
      DASH_PROTECTION_CONCERNS, DASH_MATCHING_RESULTS, DASH_SERVICE_PROVISIONS, DASH_CASES_TO_ASSIGN, DASH_WORKFLOW,
      DASH_WORKFLOW_TEAM, DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT, DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
      DASH_CASES_BY_TASK_OVERDUE_SERVICES, DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS, DASH_CASES_BY_SOCIAL_WORKER,
      DASH_PROTECTION_CONCERNS_BY_LOCATION, DASH_SHOW_NONE_VALUES,
      DASH_TASKS, DASH_FLAGS, DASH_SHARED_WITH_ME, DASH_SHARED_WITH_OTHERS, DASH_GROUP_OVERVIEW,
      DASH_SHARED_WITH_MY_TEAM, DASH_SHARED_FROM_MY_TEAM, DASH_CASE_INCIDENT_OVERVIEW, DASH_NATIONAL_ADMIN_SUMMARY
    ],
    AUDIT_LOG => [READ],
    MATCHING_CONFIGURATION => [MANAGE],
    KPI => [
      READ, KPI_ASSESSMENT_STATUS, KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE,
      KPI_AVERAGE_REFERRALS, KPI_CASE_CLOSURE_RATE, KPI_CASE_LOAD, KPI_CLIENT_SATISFACTION_RATE,
      KPI_COMPLETED_CASE_ACTION_PLANS, KPI_COMPLETED_CASE_SAFETY_PLANS, KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS,
      KPI_NUMBER_OF_CASES, KPI_NUMBER_OF_INCIDENTS, KPI_REPORTING_DELAY, KPI_SERVICES_PROVIDED,
      KPI_SUPERVISOR_TO_CASEWORKER_RATIO, KPI_TIME_FROM_CASE_OPEN_TO_CLOSE
    ],
    CODE_OF_CONDUCT => [MANAGE]
  }.freeze

  def initialize(args = {})
    super(args)
  end

  class << self
    def description(permission)
      I18n.t("permission.#{permission}")
    end

    # TODO: For right now we are just listing the different exports, but it will need a matrix setup.
    # We eventually want to limit export permission based on the resource.

    # TODO: Refactor. We really should get rid of this method, and use the per-resource methods below.
    def actions
      [READ, CREATE, WRITE, ENABLE_DISABLE_RECORD, FLAG, INCIDENT_FROM_CASE, INCIDENT_DETAILS_FROM_CASE,
       SERVICE_PROVISION_INCIDENT_DETAILS, SERVICES_SECTION_FROM_CASE, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL,
       EXPORT_PHOTO_WALL, EXPORT_UNHCR, EXPORT_DUPLICATE_ID, EXPORT_MRM_VIOLATION_XLS, EXPORT_INCIDENT_RECORDER,
       EXPORT_PDF, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, ASSIGN, ASSIGN_WITHIN_AGENCY, ASSIGN_WITHIN_USER_GROUP,
       REMOVE_ASSIGNED_USERS, TRANSFER, RECEIVE_TRANSFER, REFERRAL, RECEIVE_REFERRAL, CONSENT_OVERRIDE, SYNC_MOBILE,
       REQUEST_APPROVAL_ASSESSMENT, REQUEST_APPROVAL_CASE_PLAN, REQUEST_APPROVAL_CLOSURE, REQUEST_APPROVAL_ACTION_PLAN,
       REQUEST_APPROVAL_GBV_CLOSURE, APPROVE_ASSESSMENT, APPROVE_CASE_PLAN, APPROVE_CLOSURE, APPROVE_ACTION_PLAN,
       APPROVE_GBV_CLOSURE, COPY, MANAGE, GROUP_READ, DASH_APPROVALS_ASSESSMENT, DASH_APPROVALS_ASSESSMENT_PENDING,
       DASH_APPROVALS_CASE_PLAN, DASH_APPROVALS_CASE_PLAN_PENDING, DASH_APPROVALS_CLOSURE,
       DASH_APPROVALS_CLOSURE_PENDING, DASH_APPROVALS_ACTION_PLAN, DASH_APPROVALS_ACTION_PLAN_PENDING,
       DASH_APPROVALS_GBV_CLOSURE, DASH_APPROVALS_GBV_CLOSURE_PENDING, VIEW_RESPONSE, VIEW_PROTECTION_CONCERNS_FILTER,
       DASH_REPORTING_LOCATION, DASH_PROTECTION_CONCERNS, SEARCH_OWNED_BY_OTHERS, DISPLAY_VIEW_PAGE, REQUEST_TRANSFER,
       VIEW_PHOTO, DASH_CASE_OVERVIEW, DASH_CASE_RISK, DASH_MATCHING_RESULTS, DASH_SERVICE_PROVISIONS,
       DASH_CASES_TO_ASSIGN, DASH_WORKFLOW, DASH_WORKFLOW_TEAM, DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
       DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN, DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS, DASH_CASES_BY_TASK_OVERDUE_SERVICES,
       DASH_CASES_BY_SOCIAL_WORKER, DASH_SHOW_NONE_VALUES, DASH_PROTECTION_CONCERNS_BY_LOCATION, AGENCY_READ,
       DASH_SHARED_WITH_ME, DASH_SHARED_WITH_OTHERS, DASH_GROUP_OVERVIEW, DASH_SHARED_FROM_MY_TEAM,
       DASH_SHARED_WITH_MY_TEAM, DASH_CASE_INCIDENT_OVERVIEW, RECEIVE_REFERRAL_DIFFERENT_MODULE]
    end

    def resources
      [CASE, INCIDENT, TRACING_REQUEST, POTENTIAL_MATCH, ROLE, USER, USER_GROUP, AGENCY, WEBHOOK, METADATA, SYSTEM, REPORT,
       DASHBOARD, AUDIT_LOG, MATCHING_CONFIGURATION, DUPLICATE, CODE_OF_CONDUCT]
    end

    def records
      [CASE, INCIDENT, TRACING_REQUEST]
    end

    def management
      [SELF, GROUP, ALL, ADMIN_ONLY, AGENCY, WEBHOOK]
    end

    def all
      actions + resources + management
    end
    alias all_permissions all

    def all_grouped
      { 'actions' => actions, 'resource' => resources, 'management' => management }
    end

    def all_available
      resources.map { |r| Permission.new(resource: r, actions: RESOURCE_ACTIONS[r]) }
    end
  end

  def record?
    [CASE, INCIDENT, TRACING_REQUEST].include? resource
  end

  def resource_class
    return nil if resource.blank?

    class_str = (resource == CASE ? 'child' : resource)
    class_str.camelize.constantize
  end

  def action_symbols
    actions.map(&:to_sym)
  end

  class PermissionSerializer
    def self.dump(permissions)
      object_hash = {}
      json_hash = permissions.inject({}) do |hash, permission|
        hash[permission.resource] = permission.actions
        object_hash[Permission::AGENCY] = permission.agency_unique_ids if permission.agency_unique_ids
        object_hash[Permission::ROLE] = permission.role_unique_ids if permission.role_unique_ids
        hash
      end
      json_hash['objects'] = object_hash
      json_hash
    end

    def self.load(json_hash)
      return nil if json_hash.nil?

      object_hash = json_hash.delete('objects')
      json_hash.map do |resource, actions|
        permission = Permission.new(resource: resource, actions: actions)
        if object_hash.present?
          if resource == Permission::ROLE && object_hash.key?(Permission::ROLE)
            permission.role_unique_ids = object_hash[Permission::ROLE]
          end
          if resource == Permission::AGENCY && object_hash.key?(Permission::AGENCY)
            permission.agency_unique_ids = object_hash[Permission::AGENCY]
          end
        end
        permission
      end
    end
  end
end
