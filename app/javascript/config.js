// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
  READ_REGISTRY_RECORD,
  READ_FAMILY_RECORD,
  SHOW_USAGE_REPORTS
} from "./components/permissions/constants";
import getAdminResources from "./components/pages/admin/utils/get-admin-resources";

const API_BASE_PATH = "/api/v2";

const PASSWORD_MIN_LENGTH = 8;

// Max allowed image size for attachments
const MAX_IMAGE_SIZE = 600;

// Max allowed size for attachments
const MAX_ATTACHMENT_SIZE = 20971520;

// Time (ms) when fetch request will timeout
const FETCH_TIMEOUT = 90000;

// IndexedDB database name
const DATABASE_NAME = "primero";

// Time (ms) when the idle dialog will activate when a user is inactive
const IDLE_TIMEOUT = 15 * 1000 * 60;

// Time (ms) user has to respond to idle dialog before logged out
const IDLE_LOGOUT_TIMEOUT = 5 * 1000 * 60;

// Time (ms) how often the backend is pinged to refresh the user's token
const TOKEN_REFRESH_INTERVAL = 30 * 1000 * 60;

const PUSH_NOTIFICATION_SUBSCRIPTION_REFRESH_INTERVAL = 15 * 1000 * 60;

const CASE = "case";
const CASES = "cases";
const TRACING_REQUEST = "tracing_request";
const TRACING_REQUESTS = "tracing_requests";
const INCIDENT = "incident";
const INCIDENTS = "incidents";
const REGISTRY_RECORD = "registry_record";
const REGISTRY_RECORDS = "registry_records";
const FAMILIES = "families";
const FAMILY = "family";

// Type of records available singular (key): plural (value)
const RECORD_TYPES = {
  [CASES]: CASE,
  [TRACING_REQUESTS]: TRACING_REQUEST,
  [INCIDENTS]: INCIDENT,
  [REGISTRY_RECORDS]: REGISTRY_RECORD,
  [FAMILIES]: FAMILY,
  all: "all"
};

const RECORD_TYPES_PLURAL = {
  [CASE]: CASES,
  [TRACING_REQUEST]: TRACING_REQUESTS,
  [INCIDENT]: INCIDENTS,
  [REGISTRY_RECORD]: REGISTRY_RECORDS,
  [FAMILY]: FAMILIES
};

// Max Age allowed in age ranges
const AGE_MAX = 999;

const MODULES = Object.freeze({
  CP: "primeromodule-cp",
  GBV: "primeromodule-gbv",
  MRM: "primeromodule-mrm"
});

const MODULE_TYPE_FIELD = "module_id";

const USER_NAME_FIELD = "user_name";

const STRING_SOURCES_TYPES = Object.freeze({
  LOCATION: "Location",
  AGENCY: "Agency",
  USER: "user"
});

const ID_FIELD = "id";
const UNIQUE_ID_FIELD = "unique_id";
const DISPLAY_TEXT_FIELD = "display_text";
const NAME_FIELD = "name";
const CODE_FIELD = "code";
const INCIDENT_CASE_ID_FIELD = "incident_case_id";
const INCIDENT_CASE_ID_DISPLAY_FIELD = "case_id_display";
const INCIDENT_SHORT_ID_FIELD = "short_id";
const SERVICES_SUBFORM_FIELD = "services_section";

const CONSENT_GIVEN_FIELD_BY_MODULE = Object.freeze({
  [MODULES.CP]: ["consent_for_services", "disclosure_other_orgs"],
  [MODULES.GBV]: ["consent_for_services"]
});

const RECORD_PATH = {
  account: "account",
  agencies: "agencies",
  alerts: "alerts",
  audit_logs: "audit_logs",
  cases: "cases",
  configurations: "configurations",
  contact_information: "contact_information",
  codes_of_conduct: "codes_of_conduct",
  dashboards: "dashboards",
  families: "families",
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
  registry_records: "registry_records",
  usage_reports: "usage_reports",
  webpush_config: "webpush/config"
};

const RECORD_INFORMATION_GROUP = "record_information";

const IDENTIFICATION_REGISTRATION = "identification_registration";

const VIOLATION_GROUP = "violations";

const RECORD_OWNER = "record_owner";

const TRANSFERS_ASSIGNMENTS = "transfers_assignments";
const INCIDENT_TRANSFERS_ASSIGNMENTS = "incident_transfers_assignments";

const REFERRAL = "referral";

const APPROVALS = "approvals";

const INCIDENT_FROM_CASE = "incident_from_case";

const REGISTRY_FROM_CASE = "registry_from_case";

const CHANGE_LOGS = "change_logs";

const SUMMARY = "summary";

const SUMMARY_INCIDENT_MRM = "mrm_summary_page";

const TRANSITION_TYPE = [TRANSFERS_ASSIGNMENTS, REFERRAL];

const RECORD_INFORMATION = [APPROVALS, RECORD_OWNER, REFERRAL, TRANSFERS_ASSIGNMENTS];

const ROUTES = {
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
  families: "/families",
  forms: "/admin/forms",
  forms_new: "/admin/forms/new",
  incidents: "/incidents",
  login: "/login",
  login_idp_redirect: "/login/:id",
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
  registry_records: "/registry_records",
  subscriptions: "/webpush/subscriptions",
  subscriptions_current: "/webpush/subscriptions/current",
  usage_reports: "/admin/usage_reports"
};

const PERMITTED_URL = [
  ROUTES.account,
  ROUTES.dashboard,
  ROUTES.login,
  ROUTES.login_redirect,
  ROUTES.login_idp_redirect,
  ROUTES.logout,
  ROUTES.not_authorized,
  ROUTES.password_reset,
  ROUTES.support,
  ROUTES.cases,
  ROUTES.tracing_requests,
  ROUTES.incidents,
  ROUTES.registry_records,
  ROUTES.families,
  ROUTES.code_of_conduct,
  ROUTES.password_reset_request
];

const DATE_FORMAT = "dd-MMM-yyyy";

const DATE_FORMAT_NE = "DD-MM-YYYY";

const MONTH_AND_YEAR_FORMAT = "MMM-yyyy";

const API_DATE_FORMAT = "yyyy-MM-dd";

const API_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";

const TRANSITIONS_DATE_FORMAT = "MMM dd,yyyy";

const DATE_TIME_FORMAT = "dd-MMM-yyyy HH:mm";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// eslint-disable-next-line max-len
const ISO_DATE_TIME_REGEX =
  /^(?:\d{4}-\d{2}-\d{2}|\d{4}-\d{1,2}-\d{1,2}[T \t]+\d{1,2}:\d{2}:\d{2}(\.[0-9]*)?(([ \t]*)Z|[-+]\d{2}?(:\d{2})?)?)$/;

const CODE_OF_CONDUCT_DATE_FORMAT = "MMMM dd, yyyy";

const MODES = {
  edit: "edit",
  new: "new",
  show: "show"
};

const LOOKUPS = {
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
  gender_unknown: "lookup-gender-unknown",
  legitimate_basis: "lookup-legitimate-basis",
  legitimate_basis_explanations: "lookup-legitimate-basis-explanations",
  verification_status: "lookup-verification-status",
  violation_type: "lookup-violation-type",
  armed_force_group_or_other_party: "lookup-armed-force-group-or-other-party"
};

const ADMIN_NAV = [
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
  },
  {
    to: "/usage_reports",
    label: "settings.navigation.usage_reports",
    permission: SHOW_USAGE_REPORTS,
    recordType: RESOURCES.usage_reports
  }
];

const APPLICATION_NAV = (permissions, userId) => {
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
      name: "navigation.families",
      to: ROUTES.families,
      icon: "families",
      jewelCount: "families",
      resources: RESOURCES.families,
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

const LOCATION_PATH = "/locations";

const METHODS = Object.freeze({
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT"
});

const SAVE_METHODS = Object.freeze({
  new: "new",
  update: "update"
});

const ACCEPTED = "accepted";
const ACCEPT = "accept";
const REJECTED = "rejected";
const REVOKED = "revoked";
const DONE = "done";
const REJECT = "reject";
const SAVING = "saving";
const INPROGRESS = "in_progress";

const APPROVALS_TYPES = Object.freeze({
  assessment: "assessment",
  case_plan: "case_plan",
  closure: "closure",
  action_plan: "action_plan",
  gbv_closure: "gbv_closure"
});

const ALERTS_FOR = {
  field_change: "field_change",
  incident_details: "incident_details",
  services_section: "services_section",
  approval: "approval",
  new_form: "new_form",
  transfer_request: "transfer_request",
  duplicate_field: "duplicate_field",
  transfer: "transfer",
  referral: "referral"
};

const MAX_OFFLINE_ROWS_PER_PAGE = 50;

const ROWS_PER_PAGE_OPTIONS = [20, 50, 75, 100];

const OFFLINE_ROWS_PER_PAGE_OPTIONS = [20, 50];

const DEFAULT_METADATA = Object.freeze({
  page: 1,
  per: 20
});

const LOCALE_KEYS = {
  en: "en",
  ne: "ne"
};

const HTTP_STATUS = {
  invalidRecord: 422
};

const DEFAULT_DATE_VALUES = {
  TODAY: "TODAY",
  NOW: "NOW"
};

const FETCH_PARAM = Object.freeze({
  DATA: "data",
  OPTIONS: "options"
});

const TRACING_REQUEST_STATUS_FIELD_NAME = "tracing_request_status";

const TRACES_SUBFORM_UNIQUE_ID = "tracing_request_subform_section";

const POTENTIAL_MATCH_LIKELIHOOD = {
  likely: "likely",
  possible: "possible"
};

const MATCH_VALUES = {
  match: "match",
  mismatch: "mismatch",
  blank: "blank"
};

const FILE_FORMAT = {
  pdf: "application/pdf"
};

const FAMILY_MEMBERS_SUBFORM_ID = "family_members_section";
const FAMILY_FROM_CASE = "family_from_case";

const FAMILY_DETAILS_SUBFORM_ID = "family_details_section";

const FORM_PERMISSION_ACTION = Object.freeze({
  [INCIDENT_FROM_CASE]: VIEW_INCIDENTS_FROM_CASE,
  [CHANGE_LOGS]: SHOW_CHANGE_LOG,
  [APPROVALS]: SHOW_APPROVALS,
  [SUMMARY]: SHOW_SUMMARY,
  [REGISTRY_FROM_CASE]: READ_REGISTRY_RECORD,
  [FAMILY_FROM_CASE]: READ_FAMILY_RECORD
});

const VIOLATIONS_FORM = [
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

const VIOLATIONS_ASSOCIATIONS_FORM = [
  "individual_victims_subform_section",
  "group_victims_section",
  "source_subform_section",
  "perpetrator_subform_section",
  "response_subform_section"
];

const VIOLATIONS_SUBFORM_UNIQUE_IDS = [
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

const VIOLATION_FORMS_MAPPING = Object.freeze({
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

const VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS = [
  "individual_victims",
  "perpetrators",
  "group_victims",
  "sources",
  "responses"
];

const VIOLATIONS_ASSOCIATIONS_RESPONSES = "responses";

const MRM_INSIGHTS_SUBREPORTS = [...VIOLATIONS_SUBFORM_UNIQUE_IDS, "detention"];

const GBV_INSIGHTS_SUBREPORTS = ["incidents", "perpetrators", "survivors", "referrals"];

const GHN_REPORT_SUBREPORTS = ["ghn_report"];

const INDIVIDUAL_CHILDREN = ["individual_children"];

const WORKFLOW_SUBREPORTS = ["cases_workflow", "incidents_workflow"];

const CASES_WORKFLOW_SUBREPORTS = ["cases_workflow"];

const PROTECTION_CONCERNS_SUBREPORTS = ["protection_concerns"];

const REPORTING_LOCATIONS_SUBREPORTS = ["reporting_location_by_sex_and_age"];

const FOLLOWUPS_SUBREPORTS = ["followups"];

const SERVICES_SUBREPORTS = ["services"];

const REFERRAL_TRANSFERS_SUBREPORTS = ["total_transfers", "total_referrals"];

const VIOLENCE_TYPE_SUBREPORTS = ["cases_violence_type", "incidents_violence_type"];

const CHART_COLORS = Object.freeze({
  blue: "rgb(0, 147, 186)",
  grey: "rgb(89, 89, 82)",
  purple: "rgb(124, 52, 123)",
  green: "rgb(131, 158, 60)",
  red: "rgb(208, 16, 27)",
  orange: "rgb(231, 113, 45)",
  yellow: "rgb(242, 195, 23)"
});
const SUBFORM_READONLY_FIELD_NAMES = ["matched_case_comparison"];

const Q1 = "Q1";
const Q2 = "Q2";
const Q3 = "Q3";
const Q4 = "Q4";

const QUARTERS_TO_NUMBER = Object.freeze({
  [Q1]: 1,
  [Q2]: 2,
  [Q3]: 3,
  [Q4]: 4
});

const QUARTERS = Object.freeze([Q1, Q2, Q3, Q4]);

const VIOLATION_TYPE = Object.freeze({
  killing: "killing",
  maiming: "maiming",
  recruitment: "recruitment",
  sexual_violence: "sexual_violence",
  abduction: "abduction",
  attack_on_hospitals: "attack_on_hospitals",
  attack_on_schools: "attack_on_schools",
  military_use: "military_use",
  denial_humanitarian_access: "denial_humanitarian_access"
});

const VIOLATION_VERIFICATION_STATUS = Object.freeze({
  verified: "verified",
  report_pending_verification: "report_pending_verification",
  not_mrm: "not_mrm",
  verification_found_that_incident_did_not_occur: "verification_found_that_incident_did_not_occur"
});

const MAX_CONDITIONS = 4;

const QUICK_SEARCH_FIELDS = Object.freeze([
  "biometrics_id",
  "camp_id",
  "case_id",
  "case_id_display",
  "dss_id",
  "family_count_no",
  "icrc_ref_no",
  "name",
  "name_nickname",
  "name_other",
  "national_id_no",
  "nfi_distribution_id",
  "oscar_number",
  "other_agency_id",
  "other_id_no",
  "ration_card_no",
  "rc_id_no",
  "registry_no",
  "short_id",
  "survivor_code_no",
  "tent_number",
  "un_no",
  "unhcr_id_no",
  "unhcr_individual_no",
  "unique_identifier"
]);

const DATE_SORTABLE_FIELDS = Object.freeze([
  "created_at",
  "registration_date",
  "incident_date",
  "date_of_first_report",
  "inquiry_date"
]);

const NOTIFICATION_PERMISSIONS = {
  GRANTED: "granted",
  DENIED: "denied",
  DEFAULT: "default"
};

const POST_MESSAGES = {
  SUBSCRIBE_NOTIFICATIONS: "subscribe_notifications",
  UNSUBSCRIBE_NOTIFICATIONS: "unsubscribe_notifications",
  DISPATCH_REMOVE_SUBSCRIPTION: "dispatch_remove_subscription",
  DISPATCH_SAVE_SUBSCRIPTION: "dispatch_save_subscription",
  ATTEMPTS_SUBSCRIPTION_FAILED: "attempts_subscription_failed"
};

export {
  API_BASE_PATH,
  PASSWORD_MIN_LENGTH,
  MAX_IMAGE_SIZE,
  MAX_ATTACHMENT_SIZE,
  FETCH_TIMEOUT,
  DATABASE_NAME,
  IDLE_TIMEOUT,
  IDLE_LOGOUT_TIMEOUT,
  TOKEN_REFRESH_INTERVAL,
  PUSH_NOTIFICATION_SUBSCRIPTION_REFRESH_INTERVAL,
  CASE,
  CASES,
  TRACING_REQUEST,
  TRACING_REQUESTS,
  INCIDENT,
  INCIDENTS,
  REGISTRY_RECORD,
  REGISTRY_RECORDS,
  FAMILIES,
  FAMILY,
  RECORD_TYPES,
  RECORD_TYPES_PLURAL,
  AGE_MAX,
  MODULES,
  MODULE_TYPE_FIELD,
  USER_NAME_FIELD,
  STRING_SOURCES_TYPES,
  ID_FIELD,
  UNIQUE_ID_FIELD,
  DISPLAY_TEXT_FIELD,
  NAME_FIELD,
  CODE_FIELD,
  INCIDENT_CASE_ID_FIELD,
  INCIDENT_CASE_ID_DISPLAY_FIELD,
  INCIDENT_SHORT_ID_FIELD,
  CONSENT_GIVEN_FIELD_BY_MODULE,
  RECORD_PATH,
  RECORD_INFORMATION_GROUP,
  IDENTIFICATION_REGISTRATION,
  VIOLATION_GROUP,
  RECORD_OWNER,
  TRANSFERS_ASSIGNMENTS,
  INCIDENT_TRANSFERS_ASSIGNMENTS,
  REFERRAL,
  APPROVALS,
  INCIDENT_FROM_CASE,
  REGISTRY_FROM_CASE,
  CHANGE_LOGS,
  SUMMARY,
  SUMMARY_INCIDENT_MRM,
  TRANSITION_TYPE,
  RECORD_INFORMATION,
  ROUTES,
  PERMITTED_URL,
  DATE_FORMAT,
  DATE_FORMAT_NE,
  MONTH_AND_YEAR_FORMAT,
  API_DATE_FORMAT,
  API_DATE_TIME_FORMAT,
  TRANSITIONS_DATE_FORMAT,
  DATE_TIME_FORMAT,
  ISO_DATE_REGEX,
  ISO_DATE_TIME_REGEX,
  CODE_OF_CONDUCT_DATE_FORMAT,
  MODES,
  LOOKUPS,
  ADMIN_NAV,
  APPLICATION_NAV,
  LOCATION_PATH,
  METHODS,
  SAVE_METHODS,
  ACCEPTED,
  ACCEPT,
  REJECTED,
  REVOKED,
  DONE,
  REJECT,
  SAVING,
  INPROGRESS,
  APPROVALS_TYPES,
  ALERTS_FOR,
  MAX_OFFLINE_ROWS_PER_PAGE,
  ROWS_PER_PAGE_OPTIONS,
  OFFLINE_ROWS_PER_PAGE_OPTIONS,
  DEFAULT_METADATA,
  LOCALE_KEYS,
  HTTP_STATUS,
  DEFAULT_DATE_VALUES,
  FETCH_PARAM,
  TRACING_REQUEST_STATUS_FIELD_NAME,
  TRACES_SUBFORM_UNIQUE_ID,
  POTENTIAL_MATCH_LIKELIHOOD,
  MATCH_VALUES,
  FILE_FORMAT,
  FAMILY_MEMBERS_SUBFORM_ID,
  FAMILY_FROM_CASE,
  FAMILY_DETAILS_SUBFORM_ID,
  FORM_PERMISSION_ACTION,
  VIOLATIONS_FORM,
  VIOLATIONS_ASSOCIATIONS_FORM,
  VIOLATIONS_SUBFORM_UNIQUE_IDS,
  VIOLATION_FORMS_MAPPING,
  VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS,
  VIOLATIONS_ASSOCIATIONS_RESPONSES,
  MRM_INSIGHTS_SUBREPORTS,
  GBV_INSIGHTS_SUBREPORTS,
  GHN_REPORT_SUBREPORTS,
  INDIVIDUAL_CHILDREN,
  WORKFLOW_SUBREPORTS,
  CASES_WORKFLOW_SUBREPORTS,
  PROTECTION_CONCERNS_SUBREPORTS,
  REPORTING_LOCATIONS_SUBREPORTS,
  FOLLOWUPS_SUBREPORTS,
  SERVICES_SUBREPORTS,
  REFERRAL_TRANSFERS_SUBREPORTS,
  VIOLENCE_TYPE_SUBREPORTS,
  CHART_COLORS,
  SUBFORM_READONLY_FIELD_NAMES,
  Q1,
  Q2,
  Q3,
  Q4,
  QUARTERS_TO_NUMBER,
  QUARTERS,
  VIOLATION_TYPE,
  VIOLATION_VERIFICATION_STATUS,
  MAX_CONDITIONS,
  QUICK_SEARCH_FIELDS,
  DATE_SORTABLE_FIELDS,
  NOTIFICATION_PERMISSIONS,
  POST_MESSAGES,
  SERVICES_SUBFORM_FIELD
};
