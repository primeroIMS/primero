import {
  ACTIVITY_LOGS,
  MANAGE,
  RESOURCES,
  SHOW_AUDIT_LOGS,
  RECORD_RESOURCES,
  READ_RECORDS,
  READ_REPORTS,
  SHOW_APPROVALS,
  SHOW_CHANGE_LOG,
  SHOW_EXPORTS,
  SHOW_TASKS,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  VIEW_INCIDENTS_FROM_CASE,
  VIEW_KPIS,
  SHOW_SUMMARY,
  READ_MANAGED_REPORTS,
  READ_REGISTRY_RECORD
} from "../components/permissions/constants";
import getAdminResources from "../components/pages/admin/utils/get-admin-resources";

export const PASSWORD_MIN_LENGTH = 8;

// Max allowed image size for attachments
export const MAX_IMAGE_SIZE = 600;

// Max allowed size for attachments
export const MAX_ATTACHMENT_SIZE = 10485760;

// Time (ms) when fetch request will timeout
export const FETCH_TIMEOUT = 90000;

// IndexedDB database name
export const DATABASE_NAME = "primero";

// Time (ms) when the idle dialog will activate when a user is inactive
export const IDLE_TIMEOUT = 15 * 1000 * 60;

// Time (ms) user has to respond to idle dialog before logged out
export const IDLE_LOGOUT_TIMEOUT = 5 * 1000 * 60;

// Time (ms) how often the backend is pinged to refresh the user's token
export const TOKEN_REFRESH_INTERVAL = 30 * 1000 * 60;

export const CASE = "case";
export const CASES = "cases";
export const TRACING_REQUEST = "tracing_request";
export const TRACING_REQUESTS = "tracing_requests";
export const INCIDENT = "incident";
export const INCIDENTS = "incidents";
export const REGISTRY_RECORD = "registry_record";
export const REGISTRY_RECORDS = "registry_records";

// Type of records available singular (key): plural (value)
export const RECORD_TYPES = {
  [CASES]: CASE,
  [TRACING_REQUESTS]: TRACING_REQUEST,
  [INCIDENTS]: INCIDENT,
  [REGISTRY_RECORDS]: REGISTRY_RECORD,
  all: "all"
};

export const RECORD_TYPES_PLURAL = {
  [CASE]: CASES,
  [TRACING_REQUEST]: TRACING_REQUESTS,
  [INCIDENT]: INCIDENTS,
  [REGISTRY_RECORD]: REGISTRY_RECORDS
};

// Max Age allowed in age ranges
export const AGE_MAX = 999;

export const MODULES = Object.freeze({
  CP: "primeromodule-cp",
  GBV: "primeromodule-gbv",
  MRM: "primeromodule-mrm"
});

export const MODULE_TYPE_FIELD = "module_id";

export const USER_NAME_FIELD = "user_name";

export const STRING_SOURCES_TYPES = Object.freeze({
  LOCATION: "Location",
  AGENCY: "Agency",
  USER: "user"
});

export const ID_FIELD = "id";
export const UNIQUE_ID_FIELD = "unique_id";
export const DISPLAY_TEXT_FIELD = "display_text";
export const NAME_FIELD = "name";
export const CODE_FIELD = "code";
export const INCIDENT_CASE_ID_FIELD = "incident_case_id";
export const INCIDENT_CASE_ID_DISPLAY_FIELD = "case_id_display";
export const INCIDENT_SHORT_ID_FIELD = "short_id";

export const CONSENT_GIVEN_FIELD_BY_MODULE = Object.freeze({
  [MODULES.CP]: ["consent_for_services", "disclosure_other_orgs"],
  [MODULES.GBV]: ["consent_for_services"]
});

export const RECORD_PATH = {
  account: "account",
  agencies: "agencies",
  alerts: "alerts",
  audit_logs: "audit_logs",
  cases: "cases",
  configurations: "configurations",
  contact_information: "contact_information",
  codes_of_conduct: "codes_of_conduct",
  dashboards: "dashboards",
  flags: "flags",
  forms: "forms",
  incidents: "incidents",
  locations: "locations",
  lookups: "lookups",
  reports: "reports",
  roles: "roles",
  tasks: "tasks",
  tracing_requests: "tracing_requests",
  traces: "traces",
  user_groups: "user_groups",
  users: "users",
  activity_log: "activity_log",
  registry_records: "registry_records"
};

export const RECORD_INFORMATION_GROUP = "record_information";

export const IDENTIFICATION_REGISTRATION = "identification_registration";

export const VIOLATION_GROUP = "violations";

export const RECORD_OWNER = "record_owner";

export const TRANSFERS_ASSIGNMENTS = "transfers_assignments";

export const REFERRAL = "referral";

export const APPROVALS = "approvals";

export const INCIDENT_FROM_CASE = "incident_from_case";

export const REGISTRY_FROM_CASE = "registry_from_case";

export const CHANGE_LOGS = "change_logs";

export const SUMMARY = "summary";

export const SUMMARY_INCIDENT_MRM = "mrm_summary_page";

export const TRANSITION_TYPE = [TRANSFERS_ASSIGNMENTS, REFERRAL];

export const RECORD_INFORMATION = [APPROVALS, RECORD_OWNER, REFERRAL, TRANSFERS_ASSIGNMENTS];

export const ROUTES = {
  account: "/account",
  admin: "/admin",
  admin_agencies: "/admin/agencies",
  admin_agencies_new: "/admin/agencies/new",
  admin_roles: "/admin/roles",
  admin_roles_new: "/admin/roles/new",
  admin_user_groups: "/admin/user_groups",
  admin_user_groups_new: "/admin/user_groups/new",
  admin_users: "/admin/users",
  admin_users_new: "/admin/users/new",
  audit_logs: "/admin/audit_logs",
  cases: "/cases",
  configurations: "/admin/configurations",
  admin_configurations_new: "/admin/configurations/new",
  code_of_conduct: "/code_of_conduct",
  admin_code_of_conduct: "/admin/code_of_conduct",
  contact_information: "/admin/contact_information",
  dashboard: "/dashboards",
  exports: "/exports",
  forms: "/admin/forms",
  forms_new: "/admin/forms/new",
  incidents: "/incidents",
  login: "/login",
  logout: "/logout",
  lookups: "/admin/lookups",
  lookups_new: "/admin/lookups/new",
  matches: "/matches",
  not_authorized: "/not-authorized",
  reports: "/reports",
  reports_new: "/reports/new",
  insights: "/insights",
  key_performance_indicators: "/key_performance_indicators",
  support: "/support",
  tasks: "/tasks",
  tracing_requests: "/tracing_requests",
  check_health: "/health/api",
  check_server_health: "/health/server",
  sandbox_ui: "/primero",
  password_reset: "/password_reset",
  activity_log: "/activity_log",
  password_reset_request: "/password_reset_request",
  registry_records: "/registry_records"
};

export const PERMITTED_URL = [
  ROUTES.account,
  ROUTES.dashboard,
  ROUTES.login,
  ROUTES.login_redirect,
  ROUTES.logout,
  ROUTES.not_authorized,
  ROUTES.password_reset,
  ROUTES.support,
  ROUTES.cases,
  ROUTES.tracing_requests,
  ROUTES.incidents,
  ROUTES.registry_records,
  ROUTES.code_of_conduct,
  ROUTES.password_reset_request
];

export const DATE_FORMAT = "dd-MMM-yyyy";

export const DATE_FORMAT_NE = "DD-MM-YYYY";

export const MONTH_AND_YEAR_FORMAT = "MMM-yyyy";

export const API_DATE_FORMAT = "yyyy-MM-dd";

export const API_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";

export const TRANSITIONS_DATE_FORMAT = "MMM dd,yyyy";

export const DATE_TIME_FORMAT = "dd-MMM-yyyy HH:mm";

export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// eslint-disable-next-line max-len
export const ISO_DATE_TIME_REGEX =
  /^(?:\d{4}-\d{2}-\d{2}|\d{4}-\d{1,2}-\d{1,2}[T \t]+\d{1,2}:\d{2}:\d{2}(\.[0-9]*)?(([ \t]*)Z|[-+]\d{2}?(:\d{2})?)?)$/;

export const CODE_OF_CONDUCT_DATE_FORMAT = "MMMM dd, yyyy";

export const MODES = {
  edit: "edit",
  new: "new",
  show: "show"
};

export const LOOKUPS = {
  agency_office: "lookup-agency-office",
  risk_level: "lookup-risk-level",
  workflow: "lookup-workflow",
  service_type: "lookup-service-type",
  protection_concerns: "lookup-protection-concerns",
  followup_type: "lookup-followup-type",
  reporting_locations: "ReportingLocation",
  gbv_violence_type: "lookup-gbv-sexual-violence-type",
  cp_violence_type: "lookup-cp-violence-type",
  gender: "lookup-gender",
  legitimate_basis: "lookup-legitimate-basis",
  legitimate_basis_explanations: "lookup-legitimate-basis-explanations",
  verification_status: "lookup lookup-verification-status"
};

export const ADMIN_NAV = [
  {
    to: "/users",
    label: "settings.navigation.users",
    permission: ADMIN_ACTIONS,
    recordType: RESOURCES.users
  },
  {
    to: "/roles",
    label: "settings.navigation.roles",
    permission: ADMIN_ACTIONS,
    recordType: RESOURCES.roles
  },
  {
    to: "/user_groups",
    label: "settings.navigation.user_groups",
    permission: ADMIN_ACTIONS,
    recordType: RESOURCES.user_groups
  },
  {
    to: "/agencies",
    label: "settings.navigation.agencies",
    permission: ADMIN_ACTIONS,
    recordType: RESOURCES.agencies
  },
  {
    to: "/forms-parent",
    label: "settings.navigation.forms",
    items: [
      {
        to: "/forms",
        label: "settings.navigation.forms",
        permission: MANAGE,
        recordType: RESOURCES.metadata
      },
      {
        to: "/lookups",
        label: "settings.navigation.lookups",
        permission: MANAGE,
        recordType: RESOURCES.metadata
      }
    ],
    permission: MANAGE,
    recordType: RESOURCES.metadata
  },
  { to: "/locations", label: "settings.navigation.locations", permission: MANAGE, recordType: RESOURCES.metadata },
  {
    to: "/contact_information",
    label: "settings.navigation.contact_information",
    permission: MANAGE,
    recordType: RESOURCES.systems
  },
  {
    to: "/code_of_conduct",
    label: "settings.navigation.code_of_conduct",
    permission: MANAGE,
    recordType: RESOURCES.codes_of_conduct
  },
  {
    to: "/configurations",
    label: "settings.navigation.configurations",
    permission: MANAGE,
    recordType: RESOURCES.configurations
  },
  {
    to: "/audit_logs",
    label: "settings.navigation.audit_logs",
    permission: SHOW_AUDIT_LOGS,
    recordType: RESOURCES.audit_logs
  }
];

export const APPLICATION_NAV = (permissions, userId) => {
  const adminResources = getAdminResources(permissions);
  const adminForm = adminResources[0] || ADMIN_RESOURCES.contact_information;
  const adminSettingsOption = `/admin/${adminForm === RESOURCES.metadata ? RESOURCES.forms : adminForm}`;

  return [
    {
      name: "navigation.home",
      to: ROUTES.dashboard,
      icon: "home",
      validateWithUserPermissions: true
    },
    {
      name: "navigation.activity_log",
      to: ROUTES.activity_log,
      icon: "activity_log",
      resources: RESOURCES.activity_logs,
      actions: ACTIVITY_LOGS,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.tasks",
      to: ROUTES.tasks,
      icon: "tasks",
      resources: RESOURCES.dashboards,
      actions: SHOW_TASKS,
      disableOffline: true
    },
    {
      name: "navigation.cases",
      to: ROUTES.cases,
      icon: "cases",
      jewelCount: "case",
      resources: RESOURCES.cases,
      actions: READ_RECORDS,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.incidents",
      to: ROUTES.incidents,
      icon: "incidents",
      jewelCount: "incident",
      resources: RESOURCES.incidents,
      actions: READ_RECORDS,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.tracing_request",
      to: ROUTES.tracing_requests,
      icon: "tracing_request",
      jewelCount: "tracing_request",
      resources: RESOURCES.tracing_requests,
      actions: READ_RECORDS,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.registry_records",
      to: ROUTES.registry_records,
      icon: "registry_records",
      jewelCount: "registry_record",
      resources: RESOURCES.registry_records,
      actions: READ_RECORDS,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.insights",
      to: ROUTES.insights,
      icon: "insights",
      resources: RESOURCES.managed_reports,
      actions: READ_MANAGED_REPORTS,
      disableOffline: true,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.reports",
      to: ROUTES.reports,
      icon: "reports",
      resources: RESOURCES.reports,
      actions: READ_REPORTS,
      disableOffline: true,
      validateWithUserPermissions: true
    },
    {
      name: "navigation.key_performance_indicators",
      to: ROUTES.key_performance_indicators,
      icon: "key_performance_indicators",
      resources: RESOURCES.kpis,
      actions: VIEW_KPIS
    },
    {
      name: "navigation.bulk_exports",
      to: ROUTES.exports,
      icon: "exports",
      resources: RECORD_RESOURCES,
      actions: SHOW_EXPORTS,
      disableOffline: true
    },
    {
      name: "navigation.support",
      to: ROUTES.support,
      icon: "support",
      divider: true
    },
    {
      component: "fieldMode"
    },
    { name: "username", to: `${ROUTES.account}/${userId}`, icon: "account", disableOffline: true },
    {
      name: "navigation.settings",
      to: adminSettingsOption,
      icon: "settings",
      resources: ADMIN_RESOURCES,
      actions: ADMIN_ACTIONS,
      disableOffline: true
    },
    { name: "navigation.logout", to: ROUTES.logout, icon: "logout" }
  ];
};

export const LOCATION_PATH = "/locations";

export const METHODS = Object.freeze({
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT"
});

export const SAVE_METHODS = Object.freeze({
  new: "new",
  update: "update"
});

export const ACCEPTED = "accepted";
export const ACCEPT = "accept";
export const REJECTED = "rejected";
export const REVOKED = "revoked";
export const DONE = "done";
export const REJECT = "reject";
export const SAVING = "saving";

export const APPROVALS_TYPES = Object.freeze({
  assessment: "assessment",
  case_plan: "case_plan",
  closure: "closure",
  action_plan: "action_plan",
  gbv_closure: "gbv_closure"
});

export const ALERTS_FOR = {
  field_change: "field_change",
  incident_details: "incident_details",
  services_section: "services_section",
  approval: "approval",
  new_form: "new_form",
  transfer_request: "transfer_request",
  duplicate_field: "duplicate_field"
};

export const ROWS_PER_PAGE_OPTIONS = [20, 50, 75, 100];

export const DEFAULT_METADATA = Object.freeze({
  page: 1,
  per: 20
});

export const LOCALE_KEYS = {
  en: "en",
  ne: "ne"
};

export const HTTP_STATUS = {
  invalidRecord: 422
};

export const DEFAULT_DATE_VALUES = {
  TODAY: "TODAY",
  NOW: "NOW"
};

export const FETCH_PARAM = Object.freeze({
  DATA: "data",
  OPTIONS: "options"
});

export const TRACING_REQUEST_STATUS_FIELD_NAME = "tracing_request_status";

export const TRACES_SUBFORM_UNIQUE_ID = "tracing_request_subform_section";

export const POTENTIAL_MATCH_LIKELIHOOD = {
  likely: "likely",
  possible: "possible"
};

export const MATCH_VALUES = {
  match: "match",
  mismatch: "mismatch",
  blank: "blank"
};

export const FILE_FORMAT = {
  pdf: "application/pdf"
};

export const FORM_PERMISSION_ACTION = Object.freeze({
  [INCIDENT_FROM_CASE]: VIEW_INCIDENTS_FROM_CASE,
  [CHANGE_LOGS]: SHOW_CHANGE_LOG,
  [APPROVALS]: SHOW_APPROVALS,
  [SUMMARY]: SHOW_SUMMARY,
  [REGISTRY_FROM_CASE]: READ_REGISTRY_RECORD
});

export const VIOLATIONS_FORM = [
  "killing_violation_wrapper",
  "maiming_violation_wrapper",
  "recruitment_violation_wrapper",
  "sexual_violence_violation_wrapper",
  "abduction_violation_wrapper",
  "attack_on_hospitals_violation_wrapper",
  "attack_on_schools_violation_wrapper",
  "military_use_violation_wrapper",
  "denial_humanitarian_access_violation_wrapper"
];

export const VIOLATIONS_ASSOCIATIONS_FORM = [
  "individual_victims_subform_section",
  "group_victims_section",
  "source_subform_section",
  "perpetrator_subform_section",
  "response_subform_section"
];

export const VIOLATIONS_SUBFORM_UNIQUE_IDS = [
  "killing",
  "maiming",
  "recruitment",
  "sexual_violence",
  "abduction",
  "attack_on_hospitals",
  "attack_on_schools",
  "military_use",
  "denial_humanitarian_access"
];

export const VIOLATION_FORMS_MAPPING = Object.freeze({
  killing: "killing_violation_wrapper",
  maiming: "maiming_violation_wrapper",
  recruitment: "recruitment_violation_wrapper",
  sexual_violence: "sexual_violence_violation_wrapper",
  abduction: "abduction_violation_wrapper",
  attack_on_hospitals: "attack_on_hospitals_violation_wrapper",
  attack_on_schools: "attack_on_schools_violation_wrapper",
  military_use: "military_use_violation_wrapper",
  denial_humanitarian_access: "denial_humanitarian_access_violation_wrapper"
});

export const VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS = [
  "individual_victims",
  "perpetrators",
  "group_victims",
  "sources",
  "responses"
];

export const MRM_INSIGHTS_SUBREPORTS = [...VIOLATIONS_SUBFORM_UNIQUE_IDS, "detention"];

export const GBV_INSIGHTS_SUBREPORTS = ["incidents", "perpetrators", "survivors", "referrals"];

export const GHN_REPORT_SUBREPORTS = ["ghn_report"];

export const CHART_COLORS = Object.freeze({
  blue: "rgb(0, 147, 186)",
  grey: "rgb(89, 89, 82)",
  purple: "rgb(124, 52, 123)",
  green: "rgb(131, 158, 60)",
  red: "rgb(208, 16, 27)",
  orange: "rgb(231, 113, 45)",
  yellow: "rgb(242, 195, 23)"
});
export const SUBFORM_READONLY_FIELD_NAMES = ["matched_case_comparison"];

export const Q1 = "Q1";
export const Q2 = "Q2";
export const Q3 = "Q3";
export const Q4 = "Q4";

export const QUARTERS_TO_NUMBER = Object.freeze({
  [Q1]: 1,
  [Q2]: 2,
  [Q3]: 3,
  [Q4]: 4
});

export const QUARTERS = Object.freeze([Q1, Q2, Q3, Q4]);
