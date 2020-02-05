import { RECORD_PATH } from "../config/constants";

export const DB_STORES = Object.freeze({
  USER: "user",
  FIELDS: "fields",
  FORMS: "forms",
  OPTIONS: "options",
  RECORDS: "records",
  SYSTEM_SETTINGS: "system_settings",
  LOCATIONS: "locations",
  IDP: "idp",
  OFFLINE_REQUESTS: "offline_requests"
});

export const DB_COLLECTIONS = [
  ["records", { keyPath: "id" }, ["type", "type", { multiEntry: true }]],
  ["user", { keyPath: "user_name" }],
  ["offline_requests", { keyPath: "fromQueue" }],
  "forms",
  "fields",
  "options",
  "locations",
  "system_settings",
  "idp"
];

export const QUEUEABLE_ACTIONS = [
  RECORD_PATH.cases,
  RECORD_PATH.incidents,
  RECORD_PATH.tracing_requests
];

export const DB_COLLECTIONS_NAMES = DB_COLLECTIONS.reduce((prev, current) => {
  const obj = prev;
  const name = Array.isArray(current) ? current[0] : current;

  obj[name.toUpperCase()] = name;

  return obj;
}, {});

export const IDB_SAVEABLE_RECORD_TYPES = [
  RECORD_PATH.cases,
  RECORD_PATH.incidents,
  RECORD_PATH.tracing_requests
];

export const METHODS = Object.freeze({
  WRITE: "write",
  READ: "read"
});
