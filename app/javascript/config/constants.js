import {
  MANAGE,
  RESOURCES,
  SHOW_AUDIT_LOGS,
  RECORD_RESOURCES,
  READ_RECORDS,
  READ_REPORTS,
  SHOW_EXPORTS,
  SHOW_TASKS,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS
} from "../libs/permissions";

// Time (ms) when fetch request will timeout
export const FETCH_TIMEOUT = 50000;

// IndexedDB database name
export const DATABASE_NAME = "primero";

// Time (ms) when the idle dialog will activate when a user is inactive
export const IDLE_TIMEOUT = 15 * 1000 * 60;

// Time (ms) user has to respond to idle dialog before logged out
export const IDLE_LOGOUT_TIMEOUT = 5 * 1000 * 60;

// Time (ms) how often the backend is pinged to refresh the user's token
export const TOKEN_REFRESH_INTERVAL = 30 * 1000 * 60;

// Type of records available singular (key): plural (value)
export const RECORD_TYPES = {
  cases: "case",
  tracing_requests: "tracing_request",
  incidents: "incident",
  all: "all"
};

// Max Age allowed in age ranges
export const AGE_MAX = 999;

export const MODULES = Object.freeze({
  CP: "primeromodule-cp",
  GBV: "primeromodule-gbv"
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

export const CONSENT_GIVEN_FIELD_BY_MODULE = Object.freeze({
  [MODULES.CP]: "consent_for_services",
  [MODULES.GBV]: "disclosure_other_orgs"
});

export const RECORD_PATH = {
  agencies: "agencies",
  alerts: "alerts",
  audit_logs: "audit_logs",
  cases: "cases",
  contact_information: "contact_information",
  dashboards: "dashboards",
  forms: "forms",
  incidents: "incidents",
  lookups: "lookups",
  reports: "reports",
  roles: "roles",
  tasks: "tasks",
  tracing_requests: "tracing_requests",
  user_groups: "user_groups",
  users: "users"
};

export const RECORD_OWNER = "record_owner";

export const TRANSFERS_ASSIGNMENTS = "transfers_assignments";

export const REFERRAL = "referral";

export const APPROVALS = "approvals";

export const TRANSITION_TYPE = [TRANSFERS_ASSIGNMENTS, REFERRAL];

export const RECORD_INFORMATION = [
  APPROVALS,
  RECORD_OWNER,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
];

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
  support: "/support",
  tasks: "/tasks",
  tracing_requests: "/tracing_requests"
};

export const PERMITTED_URL = [
  ROUTES.account,
  ROUTES.dashboard,
  ROUTES.login,
  ROUTES.login_redirect,
  ROUTES.logout,
  ROUTES.not_authorized,
  ROUTES.support,
  ROUTES.cases,
  ROUTES.tracing_requests,
  ROUTES.incidents
];

export const DATE_FORMAT = "dd-MMM-yyyy";

export const TRANSITIONS_DATE_FORMAT = "MMM dd,yyyy";

export const DATE_TIME_FORMAT = "dd-MMM-yyyy HH:mm";

export const MODES = {
  edit: "edit",
  new: "new",
  show: "show"
};

export const LOOKUPS = {
  risk_level: "lookup-risk-level",
  workflow: "lookup-workflow",
  service_type: "lookup-service-type",
  protection_concerns: "lookup-protection-concerns",
  followup_type: "lookup-followup-type"
};

export const ADMIN_NAV = [
  {
    to: "/users",
    label: "settings.navigation.users",
    permission: ADMIN_ACTIONS,
    recordType: RESOURCES.users
  },
  {
    to: "/agencies",
    label: "settings.navigation.agencies",
    permission: ADMIN_ACTIONS,
    recordType: RESOURCES.agencies
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
    to: "/contact_information",
    label: "settings.navigation.contact_information",
    permission: MANAGE,
    recordType: RESOURCES.systems
  },
  { to: "/modules", label: "settings.navigation.modules", disabled: true },

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
  { to: "/locations", label: "settings.navigation.locations", disabled: true },
  {
    to: "/system_settings",
    label: "settings.navigation.system_settings",
    disabled: true
  },
  {
    to: "/audit_logs",
    label: "settings.navigation.audit_logs",
    permission: SHOW_AUDIT_LOGS,
    recordType: RESOURCES.audit_logs
  },
  { to: "/matching", label: "settings.navigation.matching", disabled: true }
];

export const APPLICATION_NAV = permissions => {
  const adminResources = ADMIN_RESOURCES.filter(adminResource =>
    permissions.keySeq().includes(adminResource)
  );
  const adminSettingsOption = `/admin/${adminResources[0]}`;

  return [
    {
      name: "navigation.home",
      to: ROUTES.dashboard,
      icon: "home",
      validateWithUserPermissions: true
    },
    {
      name: "navigation.tasks",
      to: ROUTES.tasks,
      icon: "tasks",
      resources: RESOURCES.dashboards,
      actions: SHOW_TASKS
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
    // {
    //   name: "navigation.potential_match",
    //   to: ROUTES.matches,
    //   icon: "matches",
    //   resources: RESOURCES.potential_matches,
    //   actions: READ_RECORDS,
    //   disableOffline: true
    // },
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
    { name: "username", to: ROUTES.account, icon: "account", disabled: true },
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
export const REJECT = "reject";
export const SAVING = "saving";

export const APPROVALS_TYPES = Object.freeze({
  assessment: "assessment",
  case_plan: "case_plan",
  closure: "closure"
});

export const ALERTS_FOR = {
  field_change: "field_change",
  incident_details: "incident_details",
  services_section: "services_section",
  approval: "approval",
  new_form: "new_form",
  transfer_request: "transfer_request"
};
