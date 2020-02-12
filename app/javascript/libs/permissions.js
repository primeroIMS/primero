export const ACTIONS = {
  ADD_NOTE: "add_note",
  APPROVE_BIA: 'approve_bia',
  APPROVE_CASE_PLAN: 'approve_case_plan',
  APPROVE_CLOSURE: 'approve_closure',
  ASSIGN: "assign",
  ASSIGN_WITHIN_AGENCY_PERMISSIONS: "assign_within_agency permissions",
  ASSIGN_WITHIN_USER_GROUP: "assign_within_user_group",
  CLOSE: "close",
  CREATE: "create",
  DASH_APPROVALS_ASSESSMENT: "approvals_assessment",
  DASH_APPROVALS_ASSESSMENT_PENDING: 'approvals_assessment_pending',
  DASH_APPROVALS_CASE_PLAN: "approvals_case_plan",
  DASH_APPROVALS_CASE_PLAN_PENDING: 'approvals_case_plan_pending',
  DASH_APPROVALS_CLOSURE: "approvals_closure",
  DASH_APPROVALS_CLOSURE_PENDING: 'approvals_closure_pending',
  DASH_CASE_RISK: "case_risk",
  DASH_PROTECTION_CONCERNS: "dash_protection_concerns",
  DASH_REPORTING_LOCATION: "dash_reporting_location",
  DASH_SHARED_WITH_ME: "dash_shared_with_me",
  DASH_SHARED_WITH_OTHERS: "dash_shared_with_others",
  DASH_TASKS: "dash_tasks",
  DASH_WORKFLOW: "dash_workflow",
  DASH_WORKFLOW_TEAM: "dash_workflow_team",
  DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT: "cases_by_task_overdue_assessment",
  DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN: "cases_by_task_overdue_case_plan",
  DASH_CASES_BY_TASK_OVERDUE_SERVICES: "cases_by_task_overdue_services",
  DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS: "cases_by_task_overdue_followups",
  DASH_GROUP_OVERVIEW: "dash_group_overview",
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
  INCIDENT_DETAILS_FROM_CASE: "incident_details_from_case",
  MANAGE: "manage",
  READ: "read",
  REFERRAL: "referral",
  REOPEN: "reopen",
  REQUEST_APPROVAL_BIA: 'request_approval_bia',
  REQUEST_APPROVAL_CASE_PLAN: 'request_approval_case_plan',
  REQUEST_APPROVAL_CLOSURE: 'request_approval_closure',
  SEARCH_OWNED_BY_OTHERS: "search_owned_by_others",
  SERVICES_SECTION_FROM_CASE: "services_section_from_case",
  TRANSFER: "transfer",
  WRITE: "write",
  REQUEST_APPROVAL_BIA: "request_approval_bia",
  REQUEST_APPROVAL_CASE_PLAN: "request_approval_case_plan",
  REQUEST_APPROVAL_CLOSURE: "request_approval_closure",
  RECEIVE_REFERRAL: "receive_referral",
  RECEIVE_TRANSFER: "receive_transfer"
};

const MANAGE = [ACTIONS.MANAGE];

export const RESOURCES = {
  cases: "cases",
  dashboards: "dashboards",
  incidents: "incidents",
  potential_matches: "potential_matches",
  reports: "reports",
  tracing_requests: "tracing_requests",
  users: "users"
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

export const ADMIN_ACTIONS = [
  ...MANAGE,
  ACTIONS.READ,
  ACTIONS.WRITE,
  ACTIONS.CREATE
];

export const ADMIN_RESOURCES = [RESOURCES.users];

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

export const ADD_INCIDENT = [...MANAGE, ACTIONS.INCIDENT_DETAILS_FROM_CASE];

export const ADD_SERVICE = [...MANAGE, ACTIONS.SERVICES_SECTION_FROM_CASE];

export const REQUEST_APPROVAL = [
  ...MANAGE,
  ACTIONS.REQUEST_APPROVAL_BIA,
  ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
  ACTIONS.REQUEST_APPROVAL_CLOSURE
];

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

export const SHOW_APPROVALS = [
  ...MANAGE,
  ACTIONS.APPROVE_BIA,
  ACTIONS.APPROVE_CASE_PLAN,
  ACTIONS.APPROVE_CLOSURE,
  ACTIONS.REQUEST_APPROVAL_BIA,
  ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
  ACTIONS.REQUEST_APPROVAL_CLOSURE
];

export const DASH_APPROVALS_PENDING = [
  ACTIONS.DASH_APPROVALS_ASSESSMENT_PENDING,
  ACTIONS.DASH_APPROVALS_CASE_PLAN_PENDING,
  ACTIONS.DASH_APPROVALS_CLOSURE_PENDING
];

export const DASH_APPROVALS = [
  ...DASH_APPROVALS_PENDING,
  ACTIONS.DASH_APPROVALS_ASSESSMENT,
  ACTIONS.DASH_APPROVALS_CASE_PLAN,
  ACTIONS.DASH_APPROVALS_CLOSURE
];
