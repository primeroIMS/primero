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
  alerts: "alerts",
  cases: "cases",
  dashboards: "dashboards",
  incidents: "incidents",
  tasks: "tasks",
  tracing_requests: "tracing_requests",
  users: "users",
  user_groups: "user_groups",
  agencies: "agencies",
  contact_information: "contact_information",
  roles: "roles"
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
  cases: "/cases",
  dashboard: "/dashboards",
  exports: "/exports",
  incidents: "/incidents",
  login: "/login",
  logout: "/logout",
  matches: "/matches",
  not_authorized: "/not-authorized",
  reports: "/reports",
  support: "/support",
  tasks: "/tasks",
  tracing_requests: "/tracing_requests",
  admin: "/admin",
  admin_users: "/admin/users",
  admin_users_new: "/admin/users/new",
  admin_user_groups: "/admin/user_groups",
  contact_information: "/admin/contact_information",
  admin_user_groups_new: "/admin/user_groups/new",
  admin_agencies: "/admin/agencies",
  admin_agencies_new: "/admin/agencies/new",
  admin_roles: "/admin/roles",
  admin_roles_new: "/admin/roles/new"
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
  { to: "/users", label: "settings.navigation.users" },
  { to: "/agencies", label: "settings.navigation.agencies" },
  { to: "/roles", label: "settings.navigation.roles" },
  {
    to: "/user_groups",
    label: "settings.navigation.user_groups"
  },
  {
    to: "/contact_information",
    label: "settings.navigation.contact_information",
    manageRequired: true
  },
  { to: "/modules", label: "settings.navigation.modules", disabled: true },
  { to: "/forms", label: "settings.navigation.forms", disabled: true },
  { to: "/locations", label: "settings.navigation.locations", disabled: true },
  {
    to: "/system_settings",
    label: "settings.navigation.system_settings",
    disabled: true
  },
  {
    to: "/audit_logs",
    label: "settings.navigation.audit_logs",
    disabled: true
  },
  { to: "/matching", label: "settings.navigation.matching", disabled: true }
];

export const METHODS = Object.freeze({
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT"
});

export const ACCEPTED = "accepted";
export const ACCEPT = "accept";
export const REJECTED = "rejected";
export const REJECT = "reject";
