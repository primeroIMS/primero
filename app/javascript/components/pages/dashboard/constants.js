export const DASHBOARD_NAMES = Object.freeze({
  CASE_RISK: "dashboard.case_risk",
  WORKFLOW: "dashboard.workflow",
  APPROVALS_ASSESSMENT: "dashboard.approvals_assessment",
  APPROVALS_CASE_PLAN: "dashboard.approvals_case_plan",
  APPROVALS_CLOSURE: "dashboard.approvals_closure",
  WORKFLOW_TEAM: "dashboard.workflow_team",
  REPORTING_LOCATION: "dashboard.reporting_location",
  APPROVALS_ASSESSMENT_PENDING: "dashboard.approvals_assessment_pending",
  APPROVALS_CASE_PLAN_PENDING: "dashboard.approvals_case_plan_pending",
  APPROVALS_CLOSURE_PENDING: "dashboard.approvals_closure_pending",
  PROTECTION_CONCERNS: "dashboard.dash_protection_concerns"
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

export const WORKFLOW_ORDER_NAMES = Object.freeze([
  "new",
  "reopened",
  "case_plan",
  "care_plan",
  "action_plan",
  "service_provision",
  "services_implemented",
  "closed"
]);

export const PROTECTION_CONCERNS_ORDER_NAMES = Object.freeze([
  "protection_concerns_all_cases",
  "protection_concerns_open_cases",
  "protection_concerns_new_this_week",
  "protection_concerns_closed_this_week"
]);
