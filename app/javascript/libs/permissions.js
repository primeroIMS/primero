export const PERMISSION_CONSTANTS = {
  TRANSFER: "transfer",
  MANAGE: "manage",
  ASSIGN: "assign",
  ASSIGN_WITHIN_USER_GROUP: "assign_within_user_group",
  ASSIGN_WITHIN_AGENCY_PERMISSIONS: "assign_within_agency permissions",
  REOPEN: "reopen",
  CLOSE: "close",
  ENABLE_DISABLE_RECORD: "enable_disable_record",
  ADD_NOTE: "add_note",
  READ: "read",
  REFERRAL: "referral",
  DISPLAY_VIEW_PAGE: "display_view_page",
  SEARCH_OWNED_BY_OTHERS: "search_owned_by_others",
  DASH_TASKS: "dash_tasks",
  GROUP_READ: "group_read",
  CREATE: "create",
  WRITE: "write",
  EXPORT_LIST_VIEW: "export_list_view_csv",
  EXPORT_CSV: "export_csv",
  EXPORT_EXCEL: "export_xls",
  EXPORT_JSON: "export_json",
  EXPORT_PHOTO_WALL: "export_photowall",
  EXPORT_PDF: "export_pdf",
  EXPORT_UNHCR: "export_unhcr_csv",
  EXPORT_DUPLICATE_ID: "export_duplicate_id_csv",
  EXPORT_CASE_PDF: "export_case_pdf",
  EXPORT_MRM_VIOLATION_XLS: "export_mrm_violation_xls",
  EXPORT_INCIDENT_RECORDER: "export_incident_recorder_xls",
  EXPORT_CUSTOM: "export_custom"
};

export const checkPermissions = (currentPermissions, allowedPermissions) => {
  return (
    currentPermissions &&
    currentPermissions.filter(permission => {
      return allowedPermissions.includes(permission);
    }).size > 0
  );
};
