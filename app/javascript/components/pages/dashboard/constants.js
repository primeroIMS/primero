export const DASHBOARD_NAMES = Object.freeze({
  APPROVALS_ASSESSMENT_PENDING: "dashboard.approvals_assessment_pending",
  APPROVALS_ASSESSMENT: "dashboard.approvals_assessment",
  APPROVALS_CASE_PLAN_PENDING: "dashboard.approvals_case_plan_pending",
  APPROVALS_CASE_PLAN: "dashboard.approvals_case_plan",
  APPROVALS_CLOSURE_PENDING: "dashboard.approvals_closure_pending",
  APPROVALS_CLOSURE: "dashboard.approvals_closure",
  CASE_OVERVIEW: "dashboard.case_overview",
  CASE_RISK: "dashboard.case_risk",
  CASES_BY_TASK_OVERDUE_ASSESSMENT:
    "dashboard.cases_by_task_overdue_assessment",
  CASES_BY_TASK_OVERDUE_CASE_PLAN: "dashboard.cases_by_task_overdue_case_plan",
  CASES_BY_TASK_OVERDUE_FOLLOWUPS: "dashboard.cases_by_task_overdue_followups",
  CASES_BY_TASK_OVERDUE_SERVICES: "dashboard.cases_by_task_overdue_services",
  GROUP_OVERVIEW: "dashboard.dash_group_overview",
  PROTECTION_CONCERNS: "dashboard.dash_protection_concerns",
  REPORTING_LOCATION: "dashboard.reporting_location",
  SHARED_FROM_MY_TEAM: "dashboard.dash_shared_from_my_team",
  SHARED_WITH_ME: "dashboard.dash_shared_with_me",
  SHARED_WITH_MY_TEAM: "dashboard.dash_shared_with_my_team",
  SHARED_WITH_OTHERS: "dashboard.dash_shared_with_others",
  WORKFLOW_TEAM: "dashboard.workflow_team",
  WORKFLOW: "dashboard.workflow"
});

export const INDICATOR_NAMES = Object.freeze({
  RISK_LEVEL: "risk_level",
  WORKFLOW_TEAM: "workflow_team",
  WORKFLOW: "workflow",
  REPORTING_LOCATION_OPEN: "reporting_location_open",
  REPORTING_LOCATION_OPEN_LAST_WEEK: "reporting_location_open_last_week",
  REPORTING_LOCATION_OPEN_THIS_WEEK: "reporting_location_open_this_week",
  REPORTING_LOCATION_ClOSED_LAST_WEEK: "reporting_location_closed_last_week",
  REPORTING_LOCATION_ClOSED_THIS_WEEK: "reporting_location_closed_this_week",
  PROTECTION_CONCERNS_ALL_CASES: "protection_concerns_all_cases",
  PROTECTION_CONCERNS_OPEN_CASES: "protection_concerns_open_cases",
  PROTECTION_CONCERNS_NEW_THIS_WEEK: "protection_concerns_new_this_week",
  PROTECTION_CONCERNS_CLOSED_THIS_WEEK: "protection_concerns_closed_this_week"
});

export const PROTECTION_CONCERNS_ORDER_NAMES = Object.freeze([
  INDICATOR_NAMES.PROTECTION_CONCERNS_ALL_CASES,
  INDICATOR_NAMES.PROTECTION_CONCERNS_OPEN_CASES,
  INDICATOR_NAMES.PROTECTION_CONCERNS_NEW_THIS_WEEK,
  INDICATOR_NAMES.PROTECTION_CONCERNS_CLOSED_THIS_WEEK
]);
