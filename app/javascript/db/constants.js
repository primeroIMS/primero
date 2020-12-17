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
  DASHBOARDS: "dashboards",
  LOGOS: "logos",
  MANIFESTS: "manifests",
  PERMISSIONS: "permissions",
  CONTACT_INFORMATION: "contact_information",
  PRIMERO: "primero"
});

export const DB_COLLECTIONS_V1 = [
  [DB_STORES.RECORDS, { keyPath: "id" }, ["type", "type", { multiEntry: true }]],
  [DB_STORES.USER, { keyPath: "user_name" }],
  [DB_STORES.OFFLINE_REQUESTS, { keyPath: "fromQueue" }],
  [DB_STORES.MANIFESTS, { keyPath: "collection" }],
  DB_STORES.FORMS,
  DB_STORES.FIELDS,
  DB_STORES.OPTIONS,
  DB_STORES.LOCATIONS,
  DB_STORES.SYSTEM_SETTINGS,
  DB_STORES.IDP
];

export const DB_COLLECTIONS_V2 = [DB_STORES.DASHBOARDS];

export const DB_COLLECTIONS_V3 = [DB_STORES.LOGOS];

export const DB_COLLECTIONS_V4 = [DB_STORES.PERMISSIONS, DB_STORES.CONTACT_INFORMATION, DB_STORES.PRIMERO];

export const DB_COLLECTIONS = [...DB_COLLECTIONS_V1, ...DB_COLLECTIONS_V2, ...DB_COLLECTIONS_V3, ...DB_COLLECTIONS_V4];

export const DB_COLLECTIONS_NAMES = DB_COLLECTIONS.reduce((prev, current) => {
  const obj = prev;
  const name = Array.isArray(current) ? current[0] : current;

  obj[name.toUpperCase()] = name;

  return obj;
}, {});

export const IDB_SAVEABLE_RECORD_TYPES = [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests];

export const METHODS = Object.freeze({
  WRITE: "write",
  READ: "read"
});

export const TRANSACTION_MODE = Object.freeze({
  READ_ONLY: "readonly",
  READ_WRITE: "readwrite"
});
