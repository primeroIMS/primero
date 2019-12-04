
export const ACTIONS = {
  ADD_NOTE: "add_note",
  ASSIGN: "assign",
  ASSIGN_WITHIN_AGENCY_PERMISSIONS: "assign_within_agency permissions",
  ASSIGN_WITHIN_USER_GROUP: "assign_within_user_group",
  CLOSE: "close",
  CREATE: "create",
  DASH_CASE_RISK: 'case_risk',
  DASH_TASKS: "dash_tasks",
  DISPLAY_VIEW_PAGE: "display_view_page",
  ENABLE_DISABLE_RECORD: "enable_disable_record",
  EXPORT_CASE_PDF: "export_case_pdf",
  EXPORT_CSV: "export_csv",
  EXPORT_CUSTOM: "export_custom",
  EXPORT_DUPLICATE_ID: "export_duplicate_id_csv",
  EXPORT_EXCEL: "export_xls",
  EXPORT_INCIDENT_RECORDER: "export_incident_recorder_xls",
  EXPORT_JSON: "export_json",
  EXPORT_LIST_VIEW: "export_list_view_csv",
  EXPORT_MRM_VIOLATION_XLS: "export_mrm_violation_xls",
  EXPORT_PDF: "export_pdf",
  EXPORT_PHOTO_WALL: "export_photowall",
  EXPORT_UNHCR: "export_unhcr_csv",
  FLAG: "flag",
  GROUP_READ: "group_read",
  MANAGE: "manage",
  READ: "read",
  REFERRAL: "referral",
  REOPEN: "reopen",
  SEARCH_OWNED_BY_OTHERS: "search_owned_by_others",
  TRANSFER: "transfer",
  WRITE: "write"
};

const MANAGE = [ACTIONS.MANAGE];

export const RESOURCES = {
  cases: "cases",
  dashboards: "dashboards",
  incidents: "incidents",
  potential_matches: "potential_matches",
  reports: "reports",
  tracing_requests: "tracing_requests"
};

export const checkPermissions = (currentPermissions, allowedPermissions) => {
  return (
    currentPermissions &&
    currentPermissions.filter(permission => {
      return allowedPermissions.includes(permission);
    }).size > 0
  );
};
export const RECORD_RESOURCES = [
  RESOURCES.cases,
  RESOURCES.incidents,
  RESOURCES.tracing_requests
];

export const CREATE_REPORTS = [...MANAGE, ACTIONS.CREATE];

export const READ_REPORTS = [...MANAGE, ACTIONS.READ, ACTIONS.GROUP_READ];

export const EXPORT_CUSTOM = [...MANAGE, ACTIONS.EXPORT_CUSTOM];

export const CREATE_RECORDS = [...MANAGE, ACTIONS.CREATE];

export const WRITE_RECORDS = [...MANAGE, ACTIONS.WRITE];

export const READ_RECORDS = [...MANAGE, ACTIONS.READ];

export const ENABLE_DISABLE_RECORD = [...MANAGE, ACTIONS.ENABLE_DISABLE_RECORD];

export const FLAG_RECORDS = [...MANAGE, ACTIONS.FLAG];

export const ADD_NOTE = [...MANAGE, ACTIONS.ADD_NOTE];

export const DISPLAY_VIEW_PAGE = [...MANAGE, ACTIONS.DISPLAY_VIEW_PAGE];

export const SHOW_TASKS = [...MANAGE, ACTIONS.DASH_TASKS];

export const SHOW_EXPORTS = [
  ...MANAGE,
  ACTIONS.EXPORT_CASE_PDF,
  ACTIONS.EXPORT_CSV,
  ACTIONS.EXPORT_CUSTOM,
  ACTIONS.EXPORT_DUPLICATE_ID,
  ACTIONS.EXPORT_EXCEL,
  ACTIONS.EXPORT_INCIDENT_RECORDER,
  ACTIONS.EXPORT_JSON,
  ACTIONS.EXPORT_LIST_VIEW,
  ACTIONS.EXPORT_MRM_VIOLATION_XLS,
  ACTIONS.EXPORT_PDF,
  ACTIONS.EXPORT_PHOTO_WALL,
  ACTIONS.EXPORT_UNHCR
];
