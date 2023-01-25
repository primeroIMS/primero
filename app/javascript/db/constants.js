import { RECORD_PATH } from "../config/constants";

export const DB_STORES = Object.freeze({
  TRANSLATIONS: "translations",
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
  [DB_STORES.RECORDS, { keyPath: "id" }, [["type", "type", { multiEntry: true }]]],
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

export const DB_COLLECTIONS_V5 = [DB_STORES.TRANSLATIONS];

export const DB_COLLECTIONS_V6 = [
  [
    DB_STORES.RECORDS,
    { keyPath: "id" },
    [
      ["type+case_id_display", ["type", "case_id_display"], { unique: false }],
      ["type+short_id", ["type", "short_id"], { unique: false }],
      ["type+name", ["type", "name"], { unique: false }],
      ["type+complete", ["type", "complete_sortable"], { unique: false }],
      ["type+survivor_code_no", ["type", "survivor_code_no"], { unique: false }],
      ["type+age", ["type", "age"], { unique: false }],
      ["type+sex", ["type", "sex"], { unique: false }],
      ["type+registration_date", ["type", "registration_date_sortable"], { unique: false }],
      ["type+created_at", ["type", "created_at_sortable"], { unique: false }],
      ["type+has_photo", ["type", "has_photo"], { unique: false }],
      ["type+owned_by", ["type", "owned_by"], { unique: false }],
      ["type+alert_count", ["type", "alert_count"], { unique: false }],
      ["type+flag_count", ["type", "flag_count"], { unique: false }],
      ["type+incident_date", ["type", "incident_date_sortable"], { unique: false }],
      ["type+survivor_code", ["type", "survivor_code"], { unique: false }],
      ["type+date_of_first_report", ["type", "date_of_first_report_sortable"], { unique: false }],
      ["type+gbv_sexual_violence_type", ["type", "gbv_sexual_violence_type"], { unique: false }],
      ["type+cp_incident_violence_type", ["type", "cp_incident_violence_type"], { unique: false }],
      ["type+incident_location", ["type", "incident_location"], { unique: false }],
      ["type+violation_category", ["type", "violation_category"], { unique: false }],
      ["type+relation_name", ["type", "relation_name"], { unique: false }],
      ["type+inquiry_date", ["type", "inquiry_date_sortable"], { unique: false }],
      ["type+registry_no", ["type", "registry_no"], { unique: false }]
    ]
  ]
];

export const DB_COLLECTIONS = [
  ...DB_COLLECTIONS_V1,
  ...DB_COLLECTIONS_V2,
  ...DB_COLLECTIONS_V3,
  ...DB_COLLECTIONS_V4,
  ...DB_COLLECTIONS_V5,
  ...DB_COLLECTIONS_V6
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
  RECORD_PATH.tracing_requests,
  RECORD_PATH.registry_records
];

export const METHODS = Object.freeze({
  WRITE: "write",
  READ: "read"
});

export const TRANSACTION_MODE = Object.freeze({
  READ_ONLY: "readonly",
  READ_WRITE: "readwrite"
});
