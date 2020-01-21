export const DASHBOARD_NAMES = Object.freeze({
  CASE_RISK: "dashboard.case_risk",
  WORKFLOW: "dashboard.workflow",
  APPROVALS_ASSESSMENT: "dashboard.approvals_assessment",
  APPROVALS_CASE_PLAN: "dashboard.approvals_case_plan",
  APPROVALS_CLOSURE: "dashboard.approvals_closure",
  WORKFLOW_TEAM: "dashboard.workflow_team",
  REPORTING_LOCATION: "dashboard.reporting_location"
});

export const INDICATOR_NAMES = Object.freeze({
  RISK_LEVEL: "risk_level",
  WORKFLOW_TEAM: "workflow_team",
  WORKFLOW: "workflow",
  REPORTING_LOCATION_OPEN: "reporting_location_open",
  REPORTING_LOCATION_OPEN_LAST_WEEK: "reporting_location_open_last_week",
  REPORTING_LOCATION_OPEN_THIS_WEEK: "reporting_location_open_this_week",
  REPORTING_LOCATION_ClOSED_LAST_WEEK: "reporting_location_closed_last_week",
  REPORTING_LOCATION_ClOSED_THIS_WEEK: "reporting_location_closed_this_week"
});

export const WORKFLOW_ORDER_LABELS = Object.freeze([
  "new",
  "reopened",
  "case_plan",
  "care_plan",
  "action_plan",
  "service_provision",
  "services_implemented",
  "closed"
]);
