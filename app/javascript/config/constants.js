// Time (ms) when fetch request will timeout
export const FETCH_TIMEOUT = 50000;

// IndexedDB database name
export const DATABASE_NAME = "primero";

// IndexedDB database collections
export const DB = {
  USER: "user",
  FIELDS: "fields",
  FORMS: "forms",
  OPTIONS: "options",
  RECORDS: "records",
  SYSTEM_SETTINGS: "system_settings"
};

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
  incidents: "incident"
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
  tracing_requests: "tracing_requests"
};

export const RECORD_OWNER = "record_owner";

export const TRANSFERS_ASSIGNMENTS = "transfers_assignments";

export const REFERRAL = "referral";

export const TRANSITION_TYPE = [TRANSFERS_ASSIGNMENTS, REFERRAL];

export const ROUTES = {
  account: "/account",
  cases: "/cases",
  dashboard: "/dashboard",
  exports: "/exports",
  incidents: "/incidents",
  login: "/login",
  login_redirect: "/login/:provider",
  logout: "/logout",
  matches: "/matches",
  not_authorized: "/not-authorized",
  reports: "/reports",
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
  service_type: "lookup-service-type"
};
