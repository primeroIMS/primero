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
  OFFLINE_REQUESTS: "offline_requests",
  DASHBOARDS: "dashboards"
});

export const DB_COLLECTIONS_V1 = [
  ["records", { keyPath: "id" }, ["type", "type", { multiEntry: true }]],
  ["user", { keyPath: "user_name" }],
  ["offline_requests", { keyPath: "fromQueue" }],
  ["manifests", { keyPath: "collection" }],
  "forms",
  "fields",
  "options",
  "locations",
  "system_settings",
  "idp"
];

export const DB_COLLECTIONS_V2 = ["dashboards"];

export const DB_COLLECTIONS = [...DB_COLLECTIONS_V1, ...DB_COLLECTIONS_V2];

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
