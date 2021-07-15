export const LOGIN_PATTERN = /^\/login/;
export const RESET_PATTERN = /^\/password_reset/;
export const ROOT_ROUTE = "/";
export const IS_AUTHENTICATED_PATH = ["user", "isAuthenticated"];
export const USE_IDENTITY_PROVIDER_PATH = ["idp", "use_identity_provider"];
export const LOCATION_CHANGED_ACTION = "@@router/LOCATION_CHANGE";

export const DEFAULT_FETCH_OPTIONS = {
  method: "GET",
  mode: "same-origin",
  credentials: "same-origin",
  cache: "no-cache",
  redirect: "follow",
  headers: {
    "content-type": "application/json"
  }
};
