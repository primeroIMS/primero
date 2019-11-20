class Permission < ValueObject

  # The role_ids property is used solely for the ROLE resource
  # It associates other roles with this ROLE permission
  # That restricts this role to only be able to manage those associated roles
  # If the role_ids property is empty on a ROLE permission, then that allows this role to manage all other ROLES
  attr_accessor :resource, :actions, :role_ids, :agency_ids

  READ = 'read'.freeze
  WRITE = 'write'.freeze
  ENABLE_DISABLE_RECORD = 'enable_disable_record'.freeze
  FLAG = 'flag'.freeze
  IMPORT = 'import'.freeze
  EXPORT_LIST_VIEW = 'export_list_view_csv'.freeze
  EXPORT_CSV = 'export_csv'.freeze
  EXPORT_EXCEL = 'export_xls'.freeze
  EXPORT_JSON = 'export_json'.freeze
  EXPORT_PHOTO_WALL = 'export_photowall'.freeze
  EXPORT_PDF = 'export_pdf'.freeze
  EXPORT_UNHCR = 'export_unhcr_csv'.freeze
  EXPORT_DUPLICATE_ID = 'export_duplicate_id_csv'.freeze
  EXPORT_CASE_PDF = 'export_case_pdf'.freeze
  EXPORT_MRM_VIOLATION_XLS = 'export_mrm_violation_xls'.freeze
  EXPORT_INCIDENT_RECORDER = 'export_incident_recorder_xls'.freeze
  EXPORT_CUSTOM = 'export_custom'.freeze
  REFERRAL_FROM_SERVICE = 'referral_from_service'.freeze
  CASE = 'case'.freeze
  INCIDENT = 'incident'.freeze
  TRACING_REQUEST = 'tracing_request'.freeze
  POTENTIAL_MATCH = 'potential_match'.freeze
  DUPLICATE = 'duplicate'.freeze
  USER = 'user'.freeze
  USER_GROUP = 'user_group'.freeze
  ROLE = 'role'.freeze
  AGENCY = 'agency'.freeze
  METADATA = 'metadata'.freeze
  SYSTEM = 'system'.freeze
  REPORT = 'report'.freeze
  AUDIT_LOG = 'audit_log'.freeze
  MATCHING_CONFIGURATION = 'matching_configuration'.freeze
  SELF = 'self'.freeze # A redundant permission. This is implied.
  GROUP = 'group'.freeze
  ALL = 'all'.freeze
  CONSENT_OVERRIDE = 'consent_override'.freeze
  SYNC_MOBILE = 'sync_mobile'.freeze
  REQUEST_APPROVAL_BIA = 'request_approval_bia'.freeze
  REQUEST_APPROVAL_CASE_PLAN = 'request_approval_case_plan'.freeze
  REQUEST_APPROVAL_CLOSURE = 'request_approval_closure'.freeze
  APPROVE_BIA = 'approve_bia'.freeze
  APPROVE_CASE_PLAN = 'approve_case_plan'.freeze
  APPROVE_CLOSURE = 'approve_closure'.freeze
  COPY = 'copy'.freeze
  MANAGE = 'manage'.freeze
  GROUP_READ = 'group_read'.freeze
  DASHBOARD = 'dashboard'.freeze
  DASH_APPROVALS_ASSESSMENT = 'approvals_assessment'.freeze
  DASH_APPROVALS_ASSESSMENT_PENDING = 'approvals_assessment_pending'.freeze
  DASH_APPROVALS_CASE_PLAN = 'approvals_case_plan'.freeze
  DASH_APPROVALS_CASE_PLAN_PENDING = 'approvals_case_plan_pending'.freeze
  DASH_APPROVALS_CLOSURE = 'approvals_closure'.freeze
  DASH_APPROVALS_CLOSURE_PENDING = 'approvals_closure_pending'.freeze
  VIEW_RESPONSE = 'view_response'.freeze
  VIEW_PROTECTION_CONCERNS_FILTER = 'view_protection_concerns_filter'.freeze
  DASH_CASE_OVERVIEW = 'case_overview'.freeze
  DASH_CASE_RISK = 'case_risk'.freeze
  DASH_REPORTING_LOCATION = 'dash_reporting_location'.freeze
  DASH_PROTECTION_CONCERNS = 'dash_protection_concerns'.freeze
  DASH_SERVICE_PROVISIONS = 'dash_service_provisions'.freeze
  DASH_MATCHING_RESULTS = 'dash_matching_results'.freeze
  DASH_REFFERALS_BY_SOCIAL_WORKER = 'dash_referrals_by_socal_worker'.freeze
  DASH_TRANSERS_BY_SOCIAL_WORKER = 'dash_transfers_by_socal_worker'.freeze
  DASH_CASES_BY_SOCIAL_WORKER = 'dash_cases_by_social_worker'.freeze
  DASH_MANAGER_TRANSERS = 'dash_manager_transfers'.freeze
  DASH_WORKFLOW = 'workflow'.freeze
  DASH_WORKFLOW_TEAM = 'workflow_team'.freeze
  DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT = 'cases_by_task_overdue_assessment'.freeze
  DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN = 'cases_by_task_overdue_case_plan'.freeze
  DASH_CASES_BY_TASK_OVERDUE_SERVICES = 'cases_by_task_overdue_services'.freeze
  DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS = 'cases_by_task_overdue_followups'.freeze
  DASH_CASES_TO_ASSIGN = 'dash_cases_to_assign'.freeze
  DASH_SHOW_NONE_VALUES = 'dash_show_none_values'.freeze
  DASH_TASKS = 'dash_tasks'.freeze
  DASH_PROTECTION_CONCERNS_BY_LOCATION = 'dash_protection_concerns_by_location'.freeze
  SEARCH_OWNED_BY_OTHERS = 'search_owned_by_others'.freeze
  DISPLAY_VIEW_PAGE = 'display_view_page'.freeze
  REQUEST_TRANSFER = 'request_transfer'.freeze
  VIEW_PHOTO = 'view_photo'.freeze
  INCIDENT_FROM_CASE = 'incident_from_case'.freeze
  INCIDENT_DETAILS_FROM_CASE = 'incident_details_from_case'.freeze
  SERVICES_SECTION_FROM_CASE = 'services_section_from_case'.freeze
  CREATE = 'create'.freeze
  ADMIN_ONLY = 'admin_only'.freeze
  AGENCY_READ = 'agency_read'.freeze
  REMOVE_ASSIGNED_USERS = 'remove_assigned_users'.freeze
  SERVICE_PROVISION_INCIDENT_DETAILS = 'service_provision_incident_details'.freeze
  ADD_NOTE = 'add_note'.freeze
  FIND_TRACING_MATCH = 'find_tracing_match'.freeze
  ASSIGN = 'assign'.freeze
  ASSIGN_WITHIN_AGENCY = 'assign_within_agency'.freeze
  ASSIGN_WITHIN_USER_GROUP = 'assign_within_user_group'.freeze
  TRANSFER = 'transfer'.freeze
  RECEIVE_TRANSFER = 'receive_transfer'.freeze
  REFERRAL = 'referral'.freeze
  RECEIVE_REFERRAL = 'receive_referral'.freeze
  REOPEN = 'reopen'.freeze
  CLOSE = 'close'.freeze

  def initialize(args={})
    super(args)
  end

  def self.description(permission)
    I18n.t("permission.#{permission}")
  end

  # TODO: For right now we are just listing the different exports, but it will need a matrix setup. We eventually want to
  # limit export permission based on the resource.

  # TODO: Refactor. We really should get rid of this method, and use the per-resource methods below.
  def self.actions
    [
      READ,
      CREATE,
      WRITE,
      ENABLE_DISABLE_RECORD,
      FLAG,
      INCIDENT_FROM_CASE,
      INCIDENT_DETAILS_FROM_CASE,
      SERVICE_PROVISION_INCIDENT_DETAILS,
      SERVICES_SECTION_FROM_CASE,
      EXPORT_LIST_VIEW,
      EXPORT_CSV,
      EXPORT_EXCEL,
      EXPORT_PHOTO_WALL,
      EXPORT_PDF,
      EXPORT_UNHCR,
      EXPORT_DUPLICATE_ID,
      EXPORT_MRM_VIOLATION_XLS,
      EXPORT_INCIDENT_RECORDER,
      EXPORT_CASE_PDF,
      EXPORT_JSON,
      EXPORT_CUSTOM,
      IMPORT,
      ASSIGN,
      ASSIGN_WITHIN_AGENCY,
      ASSIGN_WITHIN_USER_GROUP,
      REMOVE_ASSIGNED_USERS,
      TRANSFER,
      RECEIVE_TRANSFER,
      REFERRAL,
      RECEIVE_REFERRAL,
      CONSENT_OVERRIDE,
      SYNC_MOBILE,
      REQUEST_APPROVAL_BIA,
      REQUEST_APPROVAL_CASE_PLAN,
      REQUEST_APPROVAL_CLOSURE,
      APPROVE_BIA,
      APPROVE_CASE_PLAN,
      APPROVE_CLOSURE,
      COPY,
      MANAGE,
      GROUP_READ,
      DASH_APPROVALS_ASSESSMENT,
      DASH_APPROVALS_ASSESSMENT_PENDING,
      DASH_APPROVALS_CASE_PLAN,
      DASH_APPROVALS_CASE_PLAN_PENDING,
      DASH_APPROVALS_CLOSURE,
      DASH_APPROVALS_CASE_PLAN_PENDING,
      VIEW_RESPONSE,
      VIEW_PROTECTION_CONCERNS_FILTER,
      DASH_REPORTING_LOCATION,
      DASH_PROTECTION_CONCERNS,
      SEARCH_OWNED_BY_OTHERS,
      DISPLAY_VIEW_PAGE,
      REQUEST_TRANSFER,
      VIEW_PHOTO,
      DASH_CASE_OVERVIEW,
      DASH_CASE_RISK,
      DASH_MATCHING_RESULTS,
      DASH_SERVICE_PROVISIONS,
      DASH_CASES_TO_ASSIGN,
      DASH_WORKFLOW,
      DASH_WORKFLOW_TEAM,
      DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT,
      DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
      DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS,
      DASH_CASES_BY_TASK_OVERDUE_SERVICES,
      DASH_MANAGER_TRANSERS,
      DASH_CASES_BY_SOCIAL_WORKER,
      DASH_REFFERALS_BY_SOCIAL_WORKER,
      DASH_TRANSERS_BY_SOCIAL_WORKER,
      DASH_SHOW_NONE_VALUES,
      DASH_PROTECTION_CONCERNS_BY_LOCATION,
      AGENCY_READ
    ]
  end

  def self.resources
    [CASE, INCIDENT, TRACING_REQUEST, POTENTIAL_MATCH, ROLE, USER, USER_GROUP, AGENCY, METADATA, SYSTEM, REPORT,
     DASHBOARD, AUDIT_LOG, MATCHING_CONFIGURATION, DUPLICATE]
  end

  def self.management
    [SELF, GROUP, ALL, ADMIN_ONLY]
  end

  def self.all
    actions + resources + management
  end

  class << self
    alias_method :all_permissions, :all
  end

  def self.all_grouped
    {'actions' => actions, 'resource' => resources, 'management' => management}
  end

  def self.all_available
    resources.map{|r| Permission.new({resource: r, actions: resource_actions(r)})}
  end

  #TODO: This should just be a Hash constant
  def self.resource_actions(resource)
    case resource
    when CASE
      [READ, CREATE, WRITE, ENABLE_DISABLE_RECORD, FLAG, INCIDENT_FROM_CASE, INCIDENT_DETAILS_FROM_CASE,
       SERVICE_PROVISION_INCIDENT_DETAILS, SERVICES_SECTION_FROM_CASE, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL,
       EXPORT_PHOTO_WALL, EXPORT_PDF, EXPORT_UNHCR, EXPORT_CASE_PDF, EXPORT_DUPLICATE_ID, EXPORT_JSON, EXPORT_CUSTOM, IMPORT,
       CONSENT_OVERRIDE, SYNC_MOBILE, REQUEST_APPROVAL_BIA, REQUEST_APPROVAL_CASE_PLAN,
       REQUEST_APPROVAL_CLOSURE, APPROVE_BIA, APPROVE_CASE_PLAN, APPROVE_CLOSURE, MANAGE, SEARCH_OWNED_BY_OTHERS,
       DISPLAY_VIEW_PAGE, REQUEST_TRANSFER, VIEW_PHOTO, REFERRAL_FROM_SERVICE, ADD_NOTE, FIND_TRACING_MATCH,
       ASSIGN, ASSIGN_WITHIN_AGENCY, ASSIGN_WITHIN_USER_GROUP, REMOVE_ASSIGNED_USERS, TRANSFER,  RECEIVE_TRANSFER, REFERRAL, RECEIVE_REFERRAL, REOPEN, CLOSE]
    when INCIDENT
      [READ, CREATE, WRITE, FLAG, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL, EXPORT_PHOTO_WALL, EXPORT_PDF,
       EXPORT_UNHCR, EXPORT_INCIDENT_RECORDER, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, ASSIGN,
       SYNC_MOBILE, REQUEST_APPROVAL_BIA, REQUEST_APPROVAL_CASE_PLAN, REQUEST_APPROVAL_CLOSURE, MANAGE]
    when TRACING_REQUEST
      [READ, CREATE, WRITE, FLAG, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL, EXPORT_PHOTO_WALL, EXPORT_PDF,
       EXPORT_UNHCR, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, ASSIGN, MANAGE]
    when ROLE
      [READ, WRITE, ASSIGN, COPY, MANAGE]
    when USER
      [READ, AGENCY_READ, WRITE, ASSIGN, MANAGE]
    when USER_GROUP
      [READ, WRITE, ASSIGN, MANAGE]
    when AGENCY
      [READ, WRITE, ASSIGN, MANAGE]
    when REPORT
      [READ, GROUP_READ, CREATE, WRITE, MANAGE]
    when METADATA
      [MANAGE]
    when POTENTIAL_MATCH
      [READ]
    when DUPLICATE
      [READ]
    when SYSTEM
      [MANAGE]
    when DASHBOARD
      [DASH_CASE_OVERVIEW, DASH_CASE_RISK, DASH_APPROVALS_ASSESSMENT, DASH_APPROVALS_ASSESSMENT_PENDING,
       DASH_APPROVALS_CASE_PLAN, DASH_APPROVALS_CASE_PLAN_PENDING, DASH_APPROVALS_CLOSURE, DASH_APPROVALS_CLOSURE_PENDING,
       VIEW_RESPONSE, DASH_REPORTING_LOCATION, DASH_PROTECTION_CONCERNS,
       DASH_MATCHING_RESULTS, MANAGE, DASH_SERVICE_PROVISIONS, DASH_CASES_TO_ASSIGN, DASH_WORKFLOW, DASH_WORKFLOW_TEAM,
       DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT, DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN,
       DASH_CASES_BY_TASK_OVERDUE_SERVICES, DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS,
       DASH_MANAGER_TRANSERS, DASH_CASES_BY_SOCIAL_WORKER, DASH_REFFERALS_BY_SOCIAL_WORKER,
       DASH_TRANSERS_BY_SOCIAL_WORKER, VIEW_PROTECTION_CONCERNS_FILTER, DASH_PROTECTION_CONCERNS_BY_LOCATION,
       DASH_SHOW_NONE_VALUES, DASH_TASKS]
    when AUDIT_LOG
      [READ]
    when MATCHING_CONFIGURATION
      [MANAGE]
    else
      actions
    end
  end

  def self.all_permissions_list
    [
      self.new(:resource => CASE, :actions => [MANAGE]),
      self.new(:resource => INCIDENT, :actions => [MANAGE]),
      self.new(:resource => TRACING_REQUEST, :actions => [MANAGE]),
      self.new(:resource => POTENTIAL_MATCH, :actions => [READ]),
      self.new(:resource => DUPLICATE, :actions => [READ]),
      self.new(:resource => REPORT, :actions => [MANAGE]),
      self.new(:resource => ROLE, :actions => [MANAGE]),
      self.new(:resource => USER, :actions => [MANAGE]),
      self.new(:resource => USER_GROUP, :actions => [MANAGE]),
      self.new(:resource => AGENCY, :actions => [MANAGE]),
      self.new(:resource => METADATA, :actions => [MANAGE]),
      self.new(:resource => SYSTEM, :actions => [MANAGE]),
      self.new(:resource => DASHBOARD, :actions => [MANAGE]),
      self.new(:resource => AUDIT_LOG, :actions => [MANAGE]),
      self.new(:resource => MATCHING_CONFIGURATION, :actions => [MANAGE])
    ]
  end

  def is_record?
    [CASE, INCIDENT, TRACING_REQUEST].include? self.resource
  end

  def resource_class
    return nil if self.resource.blank?
    class_str = (self.resource == CASE ? 'child' : self.resource)
    class_str.camelize.constantize
  end

  def action_symbols
    actions.map{|a| a.to_sym}
  end

  class PermissionSerializer
    def self.dump(permissions)
      permissions.inject({}) do |hash, permission|
        hash[permission.resource] = permission.actions
        hash
      end
    end

    def self.load(json_hash)
      return nil if json_hash.nil?

      json_hash.map do |resource, actions|
        Permission.new(resource: resource, actions: actions)
      end
    end
  end

end
