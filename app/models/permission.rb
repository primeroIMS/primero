class Permission
  include CouchRest::Model::CastedModel
  include PrimeroModel

  property :resource
  property :actions, [String], :default => []

  # The role_ids property is used solely for the ROLE resource
  # It associates other roles with this ROLE permission
  # That restricts this role to only be able to manage those associated roles
  # If the role_ids property is empty on a ROLE permission, then that allows this role to manage all other ROLES
  property :role_ids, [String], :default => []
  property :agency_ids, [String], :default => []

  READ = 'read'
  WRITE = 'write'
  ENABLE_DISABLE_RECORD= 'enable_disable_record'
  FLAG = 'flag'
  IMPORT = 'import'
  EXPORT_LIST_VIEW = 'export_list_view_csv'
  EXPORT_CSV = 'export_csv'
  EXPORT_EXCEL = 'export_xls'
  EXPORT_JSON = 'export_json'
  EXPORT_PHOTO_WALL = 'export_photowall'
  EXPORT_PDF = 'export_pdf'
  EXPORT_UNHCR = 'export_unhcr_csv'
  EXPORT_DUPLICATE_ID = 'export_duplicate_id_csv'
  EXPORT_CASE_PDF = 'export_case_pdf'
  EXPORT_MRM_VIOLATION_XLS = 'export_mrm_violation_xls'
  EXPORT_INCIDENT_RECORDER = 'export_incident_recorder_xls'
  EXPORT_CUSTOM = 'export_custom'
  ASSIGN = 'assign'
  TRANSFER = 'transfer'
  REFERRAL = 'referral'
  REFERRAL_FROM_SERVICE = 'referral_from_service'
  REASSIGN = 'reassign'
  CASE = 'case'
  INCIDENT = 'incident'
  TRACING_REQUEST = 'tracing_request'
  POTENTIAL_MATCH = 'potential_match'
  USER = 'user'
  USER_GROUP = 'user_group'
  ROLE = 'role'
  AGENCY = 'agency'
  METADATA = 'metadata'
  SYSTEM = 'system'
  REPORT = 'report'
  AUDIT_LOG = 'audit_log'
  MATCHING_CONFIGURATION = 'matching_configuration'
  SELF = 'self' # A redundant permission. This is implied.
  GROUP = 'group'
  ALL = 'all'
  CONSENT_OVERRIDE = 'consent_override'
  SYNC_MOBILE = 'sync_mobile'
  REQUEST_APPROVAL_BIA = 'request_approval_bia'
  REQUEST_APPROVAL_CASE_PLAN = 'request_approval_case_plan'
  REQUEST_APPROVAL_CLOSURE = 'request_approval_closure'
  APPROVE_BIA = 'approve_bia'
  APPROVE_CASE_PLAN = 'approve_case_plan'
  APPROVE_CLOSURE = 'approve_closure'
  COPY = 'copy'
  MANAGE = 'manage'
  GROUP_READ = 'group_read'
  DASHBOARD = 'dashboard'
  VIEW_APPROVALS = 'view_approvals'
  VIEW_RESPONSE = 'view_response'
  VIEW_ASSESSMENT = 'view_assessment'
  VIEW_PROTECTION_CONCERNS_FILTER = 'view_protection_concerns_filter'
  DASH_REPORTING_LOCATION = 'dash_reporting_location'
  DASH_PROTECTION_CONCERNS = 'dash_protection_concerns'
  DASH_SERVICE_PROVISIONS = 'dash_service_provisions'
  DASH_MATCHING_RESULTS = 'dash_matching_results'
  DASH_REFFERALS_BY_SOCIAL_WORKER = 'dash_referrals_by_socal_worker'
  DASH_TRANSERS_BY_SOCIAL_WORKER = 'dash_transfers_by_socal_worker'
  DASH_CASES_BY_SOCIAL_WORKER = 'dash_cases_by_social_worker'
  DASH_MANAGER_TRANSERS = 'dash_manager_transfers'
  DASH_CASE_BY_WORKFLOW = 'dash_cases_by_workflow'
  DASH_CASES_BY_TASK_OVERDUE = 'dash_cases_by_task_overdue'
  DASH_CASES_TO_ASSIGN = 'dash_cases_to_assign'
  DASH_SHOW_NONE_VALUES = 'dash_show_none_values'
  DASH_TASKS = 'dash_tasks'
  SEARCH_OWNED_BY_OTHERS = 'search_owned_by_others'
  DISPLAY_VIEW_PAGE = 'display_view_page'
  REQUEST_TRANSFER = 'request_transfer'
  VIEW_PHOTO = 'view_photo'
  INCIDENT_FROM_CASE = 'incident_from_case'
  INCIDENT_DETAILS_FROM_CASE = 'incident_details_from_case'
  SERVICES_SECTION_FROM_CASE = 'services_section_from_case'
  CREATE = 'create'
  ADMIN_ONLY = 'admin_only'
  AGENCY_READ = 'agency_read'
  REMOVE_ASSIGNED_USERS = 'remove_assigned_users'
  SERVICE_PROVISION_INCIDENT_DETAILS = 'service_provision_incident_details'
  ADD_NOTE = 'add_note'

  validates_presence_of :resource, :message=> I18n.t("errors.models.role.permission.resource_presence")


  def self.description(permission)
    I18n.t("permission.#{permission}")
  end

  # TODO: For right now we are just listing the different exports, but it will need a matrix setup. We eventually want to
  # limit export permission based on the resource.

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
      TRANSFER,
      REASSIGN,
      REFERRAL,
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
      VIEW_APPROVALS,
      VIEW_RESPONSE,
      VIEW_ASSESSMENT,
      VIEW_PROTECTION_CONCERNS_FILTER,
      DASH_REPORTING_LOCATION,
      DASH_PROTECTION_CONCERNS,
      SEARCH_OWNED_BY_OTHERS,
      DISPLAY_VIEW_PAGE,
      REQUEST_TRANSFER,
      VIEW_PHOTO,
      DASH_MATCHING_RESULTS,
      DASH_SERVICE_PROVISIONS,
      DASH_CASES_TO_ASSIGN,
      DASH_CASE_BY_WORKFLOW,
      DASH_CASES_BY_TASK_OVERDUE,
      DASH_MANAGER_TRANSERS,
      DASH_CASES_BY_SOCIAL_WORKER,
      DASH_REFFERALS_BY_SOCIAL_WORKER,
      DASH_TRANSERS_BY_SOCIAL_WORKER,
      DASH_SHOW_NONE_VALUES,
      AGENCY_READ,
      REMOVE_ASSIGNED_USERS
    ]
  end

  def self.resources
    [CASE, INCIDENT, TRACING_REQUEST, POTENTIAL_MATCH, ROLE, USER, USER_GROUP, AGENCY, METADATA, SYSTEM, REPORT,
     DASHBOARD, AUDIT_LOG, MATCHING_CONFIGURATION]
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
    resources.map{|r| {resource: r, actions: resource_actions(r)}}
  end

  def self.resource_actions(resource)
     case resource
       when CASE
         [READ, CREATE, WRITE, ENABLE_DISABLE_RECORD, FLAG, INCIDENT_FROM_CASE, INCIDENT_DETAILS_FROM_CASE,
          SERVICE_PROVISION_INCIDENT_DETAILS, SERVICES_SECTION_FROM_CASE, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL,
          EXPORT_PHOTO_WALL, EXPORT_PDF, EXPORT_UNHCR, EXPORT_CASE_PDF, EXPORT_DUPLICATE_ID, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, ASSIGN,
          TRANSFER, REASSIGN, REFERRAL, CONSENT_OVERRIDE, SYNC_MOBILE, REQUEST_APPROVAL_BIA, REQUEST_APPROVAL_CASE_PLAN,
          REQUEST_APPROVAL_CLOSURE, APPROVE_BIA, APPROVE_CASE_PLAN, APPROVE_CLOSURE, MANAGE, SEARCH_OWNED_BY_OTHERS,
          DISPLAY_VIEW_PAGE, REQUEST_TRANSFER, VIEW_PHOTO, REFERRAL_FROM_SERVICE, REMOVE_ASSIGNED_USERS, ADD_NOTE]
       when INCIDENT
         [READ, CREATE, WRITE, FLAG, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL, EXPORT_PHOTO_WALL, EXPORT_PDF,
          EXPORT_UNHCR, EXPORT_INCIDENT_RECORDER, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, ASSIGN,
          SYNC_MOBILE, REQUEST_APPROVAL_BIA, REQUEST_APPROVAL_CASE_PLAN, REQUEST_APPROVAL_CLOSURE, MANAGE]
       when TRACING_REQUEST
         [READ, CREATE, WRITE, FLAG, EXPORT_LIST_VIEW, EXPORT_CSV, EXPORT_EXCEL, EXPORT_PHOTO_WALL, EXPORT_PDF,
          EXPORT_UNHCR, EXPORT_JSON, EXPORT_CUSTOM, IMPORT, ASSIGN, REASSIGN, MANAGE]
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
       when SYSTEM
         [MANAGE]
       when DASHBOARD
         [VIEW_APPROVALS, VIEW_RESPONSE, VIEW_ASSESSMENT, DASH_REPORTING_LOCATION, DASH_PROTECTION_CONCERNS,
          DASH_MATCHING_RESULTS, MANAGE, DASH_SERVICE_PROVISIONS, DASH_CASES_TO_ASSIGN, DASH_CASE_BY_WORKFLOW,
          DASH_CASES_BY_TASK_OVERDUE, DASH_MANAGER_TRANSERS, DASH_CASES_BY_SOCIAL_WORKER, DASH_REFFERALS_BY_SOCIAL_WORKER,
          DASH_TRANSERS_BY_SOCIAL_WORKER, VIEW_PROTECTION_CONCERNS_FILTER, DASH_SHOW_NONE_VALUES, DASH_TASKS]
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
end
