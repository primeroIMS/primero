// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const ACTIONS = {
  ADD_NOTE: "add_note",
  ADD_REGISTRY_RECORD: "add_registry_record",
  AGENCY_READ: "agency_read",
  APPROVE_ACTION_PLAN: "approve_action_plan",
  APPROVE_ASSESSMENT: "approve_assessment",
  APPROVE_CASE_PLAN: "approve_case_plan",
  APPROVE_CLOSURE: "approve_closure",
  APPROVE_GBV_CLOSURE: "approve_gbv_closure",
  ASSIGN_WITHIN_AGENCY_PERMISSIONS: "assign_within_agency permissions",
  ASSIGN_WITHIN_AGENCY: "assign_within_agency",
  ASSIGN_WITHIN_USER_GROUP: "assign_within_user_group",
  ASSIGN: "assign",
  CASE_FROM_FAMILY: "case_from_family",
  CHANGE_LOG: "change_log",
  CLOSE: "close",
  CONSENT_OVERRIDE: "consent_override",
  COPY: "copy",
  CREATE: "create",
  DASH_APPROVALS_ACTION_PLAN_PENDING: "approvals_action_plan_pending",
  DASH_APPROVALS_ACTION_PLAN: "approvals_action_plan",
  DASH_APPROVALS_ASSESSMENT_PENDING: "approvals_assessment_pending",
  DASH_APPROVALS_ASSESSMENT: "approvals_assessment",
  DASH_APPROVALS_CASE_PLAN_PENDING: "approvals_case_plan_pending",
  DASH_APPROVALS_CASE_PLAN: "approvals_case_plan",
  DASH_APPROVALS_CLOSURE_PENDING: "approvals_closure_pending",
  DASH_APPROVALS_CLOSURE: "approvals_closure",
  DASH_APPROVALS_GBV_CLOSURE_PENDING: "approvals_gbv_closure_pending",
  DASH_APPROVALS_GBV_CLOSURE: "approvals_gbv_closure",
  DASH_CASE_INCIDENT_OVERVIEW: "dash_case_incident_overview",
  DASH_CASE_OVERVIEW: "case_overview",
  DASH_ACTION_NEEDED_NEW_UPDATED: "action_needed_new_updated",
  DASH_ACTION_NEEDED_NEW_REFERRALS: "action_needed_new_referrals",
  DASH_ACTION_NEEDED_TRANSFER_AWAITING_ACCEPTANCE: "action_needed_transfer_awaiting_acceptance",
  DASH_CASE_RISK: "case_risk",
  DASH_CASES_BY_SOCIAL_WORKER: "dash_cases_by_social_worker",
  DASH_CASES_BY_TASK_OVERDUE_ASSESSMENT: "cases_by_task_overdue_assessment",
  DASH_CASES_BY_TASK_OVERDUE_CASE_PLAN: "cases_by_task_overdue_case_plan",
  DASH_CASES_BY_TASK_OVERDUE_FOLLOWUPS: "cases_by_task_overdue_followups",
  DASH_CASES_BY_TASK_OVERDUE_SERVICES: "cases_by_task_overdue_services",
  DASH_CASES_TO_ASSIGN: "dash_cases_to_assign",
  DASH_FLAGS: "dash_flags",
  DASH_GROUP_OVERVIEW: "dash_group_overview",
  DASH_NATIONAL_ADMIN_SUMMARY: "dash_national_admin_summary",
  DASH_PROTECTION_CONCERNS: "dash_protection_concerns",
  DASH_REPORTING_LOCATION: "dash_reporting_location",
  DASH_SHARED_FROM_MY_TEAM: "dash_shared_from_my_team",
  DASH_SHARED_WITH_ME: "dash_shared_with_me",
  DASH_SHARED_WITH_MY_TEAM_OVERVIEW: "dash_shared_with_my_team_overview",
  DASH_SHARED_WITH_MY_TEAM: "dash_shared_with_my_team",
  DASH_SHARED_WITH_OTHERS: "dash_shared_with_others",
  DASH_TASKS: "dash_tasks",
  DASH_WORKFLOW_TEAM: "workflow_team",
  DASH_WORKFLOW: "workflow",
  DASH_VIOLATIONS_CATEGORY_VERIFICATION_STATUS: "dash_violations_category_verification_status",
  DASH_VIOLATIONS_CATEGORY_REGION: "dash_violations_category_region",
  DASH_PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES: "dash_perpetrator_armed_force_group_party_names",
  DELETE: "delete",
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
  FIND_TRACING_MATCH: "find_tracing_match",
  FLAG: "flag",
  FLAG_RESOLVE_ANY: "resolve_any_flag",
  GBV_STATISTICS: "gbv_statistics",
  GROUP_READ: "group_read",
  INCIDENT_DETAILS_FROM_CASE: "incident_details_from_case",
  INCIDENT_FROM_CASE: "incident_from_case",
  KPI_ASSESSMENT_STATUS: "kpi_assessment_status",
  KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE: "kpi_average_followup_meetings_per_case",
  KPI_AVERAGE_REFERRALS: "kpi_average_referrals",
  KPI_CASE_CLOSURE_RATE: "kpi_case_closure_rate",
  KPI_CASE_LOAD: "kpi_case_load",
  KPI_CLIENT_SATISFACTION_RATE: "kpi_client_satisfaction_rate",
  KPI_COMPLETED_CASE_ACTION_PLANS: "kpi_completed_case_action_plans",
  KPI_COMPLETED_CASE_SAFETY_PLANS: "kpi_completed_case_safety_plans",
  KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS: "kpi_completed_supervisor_approved_case_action_plans",
  KPI_NUMBER_OF_CASES: "kpi_number_of_cases",
  KPI_NUMBER_OF_INCIDENTS: "kpi_number_of_incidents",
  KPI_REPORTING_DELAY: "kpi_reporting_delay",
  KPI_SERVICES_PROVIDED: "kpi_services_provided",
  KPI_SUPERVISOR_TO_CASEWORKER_RATIO: "kpi_supervisor_to_caseworker_ratio",
  KPI_TIME_FROM_CASE_OPEN_TO_CLOSE: "kpi_time_from_case_open_to_close",
  MANAGE: "manage",
  MARK_FOR_OFFLINE: "sync_mobile",
  LINK_INCIDENT_TO_CASE: "link_incident_to_case",
  READ: "read",
  RECEIVE_REFERRAL: "receive_referral",
  RECEIVE_TRANSFER: "receive_transfer",
  REFERRAL_FROM_SERVICE: "referral_from_service",
  REFERRAL: "referral",
  REFERRALS_TRANSFERS_REPORT: "referrals_transfers_report",
  REMOVE_ASSIGNED_USERS: "remove_assigned_users",
  REOPEN: "reopen",
  REQUEST_APPROVAL_ACTION_PLAN: "request_approval_action_plan",
  REQUEST_APPROVAL_ASSESSMENT: "request_approval_assessment",
  REQUEST_APPROVAL_CASE_PLAN: "request_approval_case_plan",
  REQUEST_APPROVAL_CLOSURE: "request_approval_closure",
  REQUEST_APPROVAL_GBV_CLOSURE: "request_approval_gbv_closure",
  REQUEST_TRANSFER: "request_transfer",
  SEARCH_OWNED_BY_OTHERS: "search_owned_by_others",
  SERVICES_SECTION_FROM_CASE: "services_section_from_case",
  SYNC_EXTERNAL: "sync_external",
  TRANSFER: "transfer",
  VERIFY_MRM: "verify_mrm",
  VIEW_INCIDENT_FROM_CASE: "view_incident_from_case",
  VIEW_REGISTRY_RECORD: "view_registry_record",
  VIOLATIONS: "violations",
  WORKFLOW_REPORT: "workflow_report",
  WRITE: "write",
  VIEW_FAMILY_RECORD: "view_family_record",
  LINK_FAMILY_RECORD: "link_family_record",
  REMOVE_ALERT: "remove_alert"
};

export const MANAGE = [ACTIONS.MANAGE];

export const RESOURCES = {
  activity_logs: "activity_logs",
  agencies: "agencies",
  any: "any",
  audit_logs: "audit_logs",
  cases: "cases",
  codes_of_conduct: "codes_of_conduct",
  configurations: "primero_configurations",
  contact_information: "contact_information",
  dashboards: "dashboards",
  families: "families",
  forms: "forms",
  incidents: "incidents",
  kpis: "kpis",
  locations: "locations",
  lookups: "lookups",
  managed_reports: "managed_reports",
  metadata: "metadata",
  potential_matches: "potential_matches",
  registry_records: "registry_records",
  reports: "reports",
  roles: "roles",
  systems: "systems",
  tracing_requests: "tracing_requests",
  usage_reports: "usage_reports",
  user_groups: "user_groups",
  users: "users",
  webhooks: "webhooks"
};

export const RECORD_RESOURCES = [RESOURCES.cases, RESOURCES.incidents, RESOURCES.tracing_requests];

export const ADMIN_ACTIONS = [...MANAGE, ACTIONS.READ, ACTIONS.WRITE, ACTIONS.CREATE];

export const ADMIN_RESOURCES = [
  RESOURCES.users,
  RESOURCES.roles,
  RESOURCES.user_groups,
  RESOURCES.agencies,
  RESOURCES.forms,
  RESOURCES.metadata,
  RESOURCES.audit_logs,
  RESOURCES.webhooks,
  RESOURCES.usage_reports
];

export const SEARCH_OTHERS = [...MANAGE, ACTIONS.SEARCH_OWNED_BY_OTHERS];

export const WRITE_REGISTRY_RECORD = [...MANAGE, ACTIONS.ADD_REGISTRY_RECORD];

export const READ_REGISTRY_RECORD = [...MANAGE, ACTIONS.VIEW_REGISTRY_RECORD];

export const READ_FAMILY_RECORD = [...MANAGE, ACTIONS.VIEW_FAMILY_RECORD];

export const CREATE_REPORTS = [...MANAGE, ACTIONS.CREATE];

export const READ_REPORTS = [...MANAGE, ACTIONS.READ, ACTIONS.GROUP_READ, ACTIONS.AGENCY_READ];

export const READ_MANAGED_REPORTS = [
  ...MANAGE,
  ACTIONS.GBV_STATISTICS,
  ACTIONS.VIOLATIONS,
  ACTIONS.WORKFLOW_REPORT,
  ACTIONS.REFERRALS_TRANSFERS_REPORT
];

export const EXPORT_CUSTOM = [...MANAGE, ACTIONS.EXPORT_CUSTOM];

export const CREATE_RECORDS = [...MANAGE, ACTIONS.CREATE];

export const WRITE_RECORDS = [...MANAGE, ACTIONS.WRITE];

export const COPY_ROLES = [...MANAGE, ACTIONS.COPY];

export const READ_RECORDS = [...MANAGE, ACTIONS.READ];

export const ENABLE_DISABLE_RECORD = [...MANAGE, ACTIONS.ENABLE_DISABLE_RECORD];

export const FLAG_RECORDS = [...MANAGE, ACTIONS.FLAG];

export const FLAG_RESOLVE_ANY = [...MANAGE, ACTIONS.FLAG_RESOLVE_ANY];

export const ADD_NOTE = [...MANAGE, ACTIONS.ADD_NOTE];

export const MARK_FOR_OFFLINE = [...MANAGE, ACTIONS.MARK_FOR_OFFLINE];

export const LINK_INCIDENT_TO_CASE = [...MANAGE, ACTIONS.LINK_INCIDENT_TO_CASE];

export const DISPLAY_VIEW_PAGE = [...MANAGE, ACTIONS.DISPLAY_VIEW_PAGE];

export const SHOW_TASKS = [...MANAGE, ACTIONS.DASH_TASKS];

export const ADD_INCIDENT = [...MANAGE, ACTIONS.INCIDENT_DETAILS_FROM_CASE];

export const CREATE_INCIDENT = [...MANAGE, ACTIONS.INCIDENT_FROM_CASE];

export const ADD_SERVICE = [...MANAGE, ACTIONS.SERVICES_SECTION_FROM_CASE];

export const SHOW_AUDIT_LOGS = [...MANAGE, ACTIONS.READ];

export const REFER_FROM_SERVICE = [...MANAGE, ACTIONS.REFERRAL, ACTIONS.REFERRAL_FROM_SERVICE];

export const ACTIVITY_LOGS = [...MANAGE, ACTIONS.TRANSFER];

export const SHOW_USAGE_REPORTS = [...MANAGE, ACTIONS.READ];

export const REQUEST_APPROVAL = [
  ...MANAGE,
  ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
  ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
  ACTIONS.REQUEST_APPROVAL_CLOSURE,
  ACTIONS.REQUEST_APPROVAL_ACTION_PLAN,
  ACTIONS.REQUEST_APPROVAL_GBV_CLOSURE
];

export const APPROVAL = [
  ...MANAGE,
  ACTIONS.APPROVE_ASSESSMENT,
  ACTIONS.APPROVE_CASE_PLAN,
  ACTIONS.APPROVE_CLOSURE,
  ACTIONS.APPROVE_ACTION_PLAN,
  ACTIONS.APPROVE_GBV_CLOSURE
];

export const EXPORTS_PERMISSIONS = [
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

export const SHOW_EXPORTS = [...MANAGE, ...EXPORTS_PERMISSIONS];
export const SHOW_CHANGE_LOG = [...MANAGE, ACTIONS.CHANGE_LOG];

export const SHOW_APPROVALS = [
  ...MANAGE,
  ACTIONS.APPROVE_ASSESSMENT,
  ACTIONS.APPROVE_CASE_PLAN,
  ACTIONS.APPROVE_CLOSURE,
  ACTIONS.APPROVE_ACTION_PLAN,
  ACTIONS.APPROVE_GBV_CLOSURE,
  ACTIONS.REQUEST_APPROVAL_ASSESSMENT,
  ACTIONS.REQUEST_APPROVAL_CASE_PLAN,
  ACTIONS.REQUEST_APPROVAL_CLOSURE,
  ACTIONS.REQUEST_APPROVAL_ACTION_PLAN,
  ACTIONS.REQUEST_APPROVAL_GBV_CLOSURE
];

export const DASH_APPROVALS_PENDING = [
  ACTIONS.DASH_APPROVALS_ASSESSMENT_PENDING,
  ACTIONS.DASH_APPROVALS_CASE_PLAN_PENDING,
  ACTIONS.DASH_APPROVALS_CLOSURE_PENDING,
  ACTIONS.DASH_APPROVALS_ACTION_PLAN_PENDING,
  ACTIONS.DASH_APPROVALS_GBV_CLOSURE_PENDING
];

export const DASH_APPROVALS = [
  ...DASH_APPROVALS_PENDING,
  ACTIONS.DASH_APPROVALS_ASSESSMENT,
  ACTIONS.DASH_APPROVALS_CASE_PLAN,
  ACTIONS.DASH_APPROVALS_CLOSURE,
  ACTIONS.DASH_APPROVALS_ACTION_PLAN,
  ACTIONS.DASH_APPROVALS_GBV_CLOSURE
];

export const VIEW_INCIDENTS_FROM_CASE = [...MANAGE, ACTIONS.VIEW_INCIDENT_FROM_CASE];

export const GROUP_PERMISSIONS = {
  AGENCY: "agency",
  ALL: "all",
  GROUP: "group",
  SELF: "self"
};

export const MANAGED_REPORT_SCOPE = {
  AGENCY: "agency",
  ALL: "all",
  GROUP: "group"
};

export const ASSIGN = [
  ACTIONS.MANAGE,
  ACTIONS.ASSIGN,
  ACTIONS.ASSIGN_WITHIN_USER_GROUP,
  ACTIONS.ASSIGN_WITHIN_AGENCY,
  ACTIONS.ASSIGN_WITHIN_AGENCY_PERMISSIONS
];

export const READ_KPIS = [ACTIONS.READ];

export const SHOW_FIND_MATCH = [...MANAGE, ACTIONS.READ];

export const SHOW_SUMMARY = [...MANAGE, ACTIONS.FIND_TRACING_MATCH];

export const VIEW_KPIS = [
  ACTIONS.READ,
  ACTIONS.KPI_ASSESSMENT_STATUS,
  ACTIONS.KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE,
  ACTIONS.KPI_AVERAGE_REFERRALS,
  ACTIONS.KPI_CASE_CLOSURE_RATE,
  ACTIONS.KPI_CASE_LOAD,
  ACTIONS.KPI_CLIENT_SATISFACTION_RATE,
  ACTIONS.KPI_COMPLETED_CASE_ACTION_PLANS,
  ACTIONS.KPI_COMPLETED_CASE_SAFETY_PLANS,
  ACTIONS.KPI_COMPLETED_SUPERVISOR_APPROVED_CASE_ACTION_PLANS,
  ACTIONS.KPI_NUMBER_OF_CASES,
  ACTIONS.KPI_NUMBER_OF_INCIDENTS,
  ACTIONS.KPI_REPORTING_DELAY,
  ACTIONS.KPI_SERVICES_PROVIDED,
  ACTIONS.KPI_SUPERVISOR_TO_CASEWORKER_RATIO,
  ACTIONS.KPI_TIME_FROM_CASE_OPEN_TO_CLOSE
];

export const SHOW_SYNC_EXTERNAL = [...MANAGE, ACTIONS.SYNC_EXTERNAL];

export const CONSENT_OVERRIDE = [...MANAGE, ACTIONS.CONSENT_OVERRIDE];

export const CREATE_CASE_FROM_FAMILY = [...MANAGE, ACTIONS.CASE_FROM_FAMILY];

export const LINK_FAMILY_RECORD_FROM_CASE = [...MANAGE, ACTIONS.LINK_FAMILY_RECORD];

export const VIEW_FAMILY_RECORD_FROM_CASE = [...MANAGE, ACTIONS.VIEW_FAMILY_RECORD];

export const REMOVE_ALERT = [...MANAGE, ACTIONS.REMOVE_ALERT];
