// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const NAME = "Dashboard";

export const DASHBOARD_NAMES = Object.freeze({
  APPROVALS_ASSESSMENT_PENDING: "dashboard.approvals_assessment_pending",
  APPROVALS_ASSESSMENT: "dashboard.approvals_assessment",
  APPROVALS_CASE_PLAN_PENDING: "dashboard.approvals_case_plan_pending",
  APPROVALS_CASE_PLAN: "dashboard.approvals_case_plan",
  APPROVALS_CLOSURE_PENDING: "dashboard.approvals_closure_pending",
  APPROVALS_CLOSURE: "dashboard.approvals_closure",
  APPROVALS_ACTION_PLAN_PENDING: "dashboard.approvals_action_plan_pending",
  APPROVALS_ACTION_PLAN: "dashboard.approvals_action_plan",
  APPROVALS_GBV_CLOSURE_PENDING: "dashboard.approvals_gbv_closure_pending",
  APPROVALS_GBV_CLOSURE: "dashboard.approvals_gbv_closure",
  CASE_INCIDENT_OVERVIEW: "dashboard.dash_case_incident_overview",
  CASE_OVERVIEW: "dashboard.case_overview",
  ACTION_NEEDED_NEW_UPDATED: "dashboard.action_needed_new_updated",
  ACTION_NEEDED_NEW_REFERRALS: "dashboard.action_needed_new_referrals",
  ACTION_NEEDED_NEW_TRANSFER_AWAITING_ACCEPTANCE: "dashboard.action_needed_transfer_awaiting_acceptance",
  CASE_RISK: "dashboard.case_risk",
  CASES_TO_ASSIGN: "dashboard.dash_cases_to_assign",
  CASES_BY_SOCIAL_WORKER: "dashboard.dash_cases_by_social_worker",
  CASES_BY_TASK_OVERDUE_ASSESSMENT: "dashboard.cases_by_task_overdue_assessment",
  CASES_BY_TASK_OVERDUE_CASE_PLAN: "dashboard.cases_by_task_overdue_case_plan",
  CASES_BY_TASK_OVERDUE_FOLLOWUPS: "dashboard.cases_by_task_overdue_followups",
  CASES_BY_TASK_OVERDUE_SERVICES: "dashboard.cases_by_task_overdue_services",
  GROUP_OVERVIEW: "dashboard.dash_group_overview",
  NATIONAL_ADMIN_SUMMARY: "dashboard.dash_national_admin_summary",
  PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES: "dashboard.dash_perpetrator_armed_force_group_party_names",
  PROTECTION_CONCERNS: "dashboard.dash_protection_concerns",
  REPORTING_LOCATION: "dashboard.reporting_location",
  SHARED_FROM_MY_TEAM: "dashboard.dash_shared_from_my_team",
  SHARED_WITH_ME: "dashboard.dash_shared_with_me",
  SHARED_WITH_MY_TEAM: "dashboard.dash_shared_with_my_team",
  SHARED_WITH_MY_TEAM_OVERVIEW: "dashboard.dash_shared_with_my_team_overview",
  SHARED_WITH_OTHERS: "dashboard.dash_shared_with_others",
  VIOLATIONS_CATEGORY_VERIFICATION_STATUS: "dashboard.dash_violations_category_verification_status",
  VIOLATIONS_CATEGORY_REGION: "dashboard.dash_violations_category_region",
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
  PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES: "perpetrator_armed_force_group_party_names",
  PROTECTION_CONCERNS_ALL_CASES: "protection_concerns_all_cases",
  PROTECTION_CONCERNS_OPEN_CASES: "protection_concerns_open_cases",
  PROTECTION_CONCERNS_NEW_THIS_WEEK: "protection_concerns_new_this_week",
  PROTECTION_CONCERNS_CLOSED_THIS_WEEK: "protection_concerns_closed_this_week",
  VIOLATIONS_CATEGORY_VERIFICATION_STATUS: "violations_category_verification_status"
});

export const PROTECTION_CONCERNS_ORDER_NAMES = Object.freeze([
  INDICATOR_NAMES.PROTECTION_CONCERNS_ALL_CASES,
  INDICATOR_NAMES.PROTECTION_CONCERNS_OPEN_CASES,
  INDICATOR_NAMES.PROTECTION_CONCERNS_NEW_THIS_WEEK,
  INDICATOR_NAMES.PROTECTION_CONCERNS_CLOSED_THIS_WEEK
]);

export const DASHBOARD_TYPES = Object.freeze({
  BADGED_INDICATOR: "badged_indicator",
  OVERVIEW_BOX: "overview_box",
  TOTAL_BOX: "total_box"
});

export const DASHBOARD_FLAGS_SORT_ORDER = "desc";

export const DASHBOARD_FLAGS_SORT_FIELD = "created_at";

export const RISK_LEVELS = Object.freeze({
  HIGH: "high",
  LOW: "low"
});

export const MAX_VISIBLE_DASHBOARDS = 2;

export const DASHBOARD_GROUP = Object.freeze({
  overview: "overview",
  action_needed: "action_needed",
  overdue_tasks: "overdue_tasks",
  workflow: "workflow",
  approvals: "approvals",
  referrals_transfers: "referrals_transfers",
  shared_from_my_team: "shared_from_my_team",
  shared_with_my_team: "shared_with_my_team",
  cases_to_assign: "cases_to_assign",
  cases_by_social_worker: "cases_by_social_worker",
  workflow_team: "workflow_team",
  reporting_location: "reporting_location",
  protection_concerns: "protection_concerns",
  violations_category_verification_status: "violations_category_verification_status",
  violations_category_region: "violations_category_region",
  perpetrator_armed_force_group_party_names: "perpetrator_armed_force_group_party_names",
  flags: "flags"
});

export const DASHBOARD_NAMES_FOR_GROUP = Object.freeze({
  [DASHBOARD_GROUP.overview]: [
    "case_overview",
    "case_risk",
    "dash_group_overview",
    "dash_case_incident_overview",
    "dash_national_admin_summary"
  ],
  [DASHBOARD_GROUP.action_needed]: [
    "action_needed_new_updated",
    "action_needed_new_referrals",
    "action_needed_transfer_awaiting_acceptance"
  ],
  [DASHBOARD_GROUP.overdue_tasks]: [
    "cases_by_task_overdue_assessment",
    "cases_by_task_overdue_case_plan",
    "cases_by_task_overdue_followups",
    "cases_by_task_overdue_services"
  ],
  [DASHBOARD_GROUP.approvals]: [
    "approvals_action_plan_pending",
    "approvals_assessment_pending",
    "approvals_case_plan_pending",
    "approvals_closure_pending",
    "approvals_gbv_closure_pending",
    "approvals_action_plan",
    "approvals_assessment",
    "approvals_case_plan",
    "approvals_closure",
    "approvals_gbv_closure"
  ],
  [DASHBOARD_GROUP.referrals_transfers]: [
    "dash_shared_with_me",
    "dash_shared_with_others",
    "dash_shared_with_my_team_overview"
  ],
  [DASHBOARD_GROUP.workflow]: ["workflow"],
  [DASHBOARD_GROUP.cases_to_assign]: ["dash_cases_to_assign"],
  [DASHBOARD_GROUP.shared_from_my_team]: ["dash_shared_from_my_team"],
  [DASHBOARD_GROUP.shared_with_my_team]: ["dash_shared_with_my_team"],
  [DASHBOARD_GROUP.cases_by_social_worker]: ["dash_cases_by_social_worker"],
  [DASHBOARD_GROUP.workflow_team]: ["workflow_team"],
  [DASHBOARD_GROUP.reporting_location]: ["reporting_location"],
  [DASHBOARD_GROUP.protection_concerns]: ["dash_protection_concerns"],
  [DASHBOARD_GROUP.violations_category_verification_status]: ["dash_violations_category_verification_status"],
  [DASHBOARD_GROUP.violations_category_region]: ["dash_violations_category_region"],
  [DASHBOARD_GROUP.perpetrator_armed_force_group_party_names]: ["dash_perpetrator_armed_force_group_party_names"]
});
