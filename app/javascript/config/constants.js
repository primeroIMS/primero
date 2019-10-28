// Time (ms) when fetch request will timeout
export const FETCH_TIMEOUT = 30000;

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

export const PERMITTED_URL = [
  "/dashboard",
  "/login",
  "/logout",
  "/not-authorized",
  "/support"
];

export const MODULES = Object.freeze({
  CP: "primeromodule-cp",
  GBV: "primeromodule-gbv"
});

export const MODULE_TYPE_FIELD = "module_id";

export const CONSENT_GIVEN_FIELD_BY_MODULE = Object.freeze({
  [MODULES.CP]: "consent_for_services",
  [MODULES.GBV]: "disclosure_other_orgs"
});

export const PERMISSIONS = {
  MANAGE: "manage",
  SEARCH_OWNED_BY_OTHERS: "search_owned_by_others"
};

export const RECORD_PATH = {
  cases: "cases",
  tracing_requests: "tracing_requests",
  incidents: "incidents"
};

export const TRANSITION_TYPE = ["transfers_assignments", "referral"];

export const RECORD_OWNER = "record_owner";

export const TRANSFERS_ASSIGNMENTS = "transfers_assignments";

export const CASES_BY_NATIONALITY = "CASES_BY_NATIONALITY";

export const CASES_BY_AGE_AND_SEX = "CASES_BY_AGE_AND_SEX";

export const CASES_BY_PROTECTION_CONCERN = "CASES_BY_PROTECTION_CONCERN";

export const CASES_BY_AGENCY = "CASES_BY_AGENCY";

export const USERS_ASSIGN_TO = "users/assign-to";

export const USERS_TRANSFER_TO = "users/transfer-to";

export const USERS_REFER_TO = "users/refer-to";

export const CASES_ASSIGNS = "cases/assigns";

export const CASES_TRANSFERS = "cases/transfers";

export const CASES_REFERRALS = "cases/referrals";
