// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { selectUserModules } from "../../application";

import { DASHBOARD_GROUP, DASHBOARD_NAMES } from "./constants";
import NAMESPACE from "./namespace";

export const selectFlags = state => {
  return state.getIn(["records", NAMESPACE, "flags"], fromJS({}));
};

export const selectIsOpenPageActions = state => {
  return state.getIn(["records", NAMESPACE, "isOpenPageActions"], false);
};

export const getDashboards = state => {
  return state.getIn(["records", NAMESPACE, "data"], false);
};

export const getDashboardsByGroup = (state, group) => {
  return state.getIn(["records", NAMESPACE, group], fromJS({}));
};

export const getDashboardByGroupAndName = (state, group, name, moduleID) => {
  const currentState = getDashboardsByGroup(state, group)?.get("data") || fromJS([]);
  const dashboardName = moduleID ? [name, ".", moduleID].join("") : name;
  const dashboardData = currentState?.filter(f => f.get("name") === dashboardName)?.first();

  return dashboardData?.size ? dashboardData : fromJS({});
};

export const getDashboardByName = (state, name, moduleID) => {
  const currentState = getDashboards(state);
  const noDashboard = fromJS({});
  const dashboardName = moduleID ? [name, ".", moduleID].join("") : name;

  if (!currentState) {
    return noDashboard;
  }

  const dashboardData = currentState.filter(f => f.get("name") === dashboardName).first();

  return dashboardData?.size ? dashboardData : noDashboard;
};

export const getCasesByRiskLevel = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overview, DASHBOARD_NAMES.CASE_RISK);

export const getWorkflowIndividualCases = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.workflow, DASHBOARD_NAMES.WORKFLOW).deleteIn(["stats", "closed"]);

export const selectApprovalIndicator = (state, indicator) => {
  const userModules = selectUserModules(state);

  return userModules.reduce((prev, current) => {
    return {
      ...prev,
      [current.unique_id]: getDashboardByGroupAndName(state, DASHBOARD_GROUP.approvals, indicator, current.unique_id)
    };
  }, {});
};

export const getApprovalsAssessment = state => selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_ASSESSMENT);

export const getApprovalsCasePlan = state => selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_CASE_PLAN);

export const getApprovalsClosure = state => selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_CLOSURE);

export const getApprovalsActionPlan = state => selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_ACTION_PLAN);

export const getApprovalsGbvClosure = state => selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_GBV_CLOSURE);

export const getWorkflowTeamCases = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.workflow_team, DASHBOARD_NAMES.WORKFLOW_TEAM);

export const getViolationsCategoryVerificationStatus = state =>
  getDashboardByGroupAndName(
    state,
    DASHBOARD_GROUP.violations_category_verification_status,
    DASHBOARD_NAMES.VIOLATIONS_CATEGORY_VERIFICATION_STATUS
  );

export const getViolationsCategoryRegion = state =>
  getDashboardByGroupAndName(
    state,
    DASHBOARD_GROUP.violations_category_region,
    DASHBOARD_NAMES.VIOLATIONS_CATEGORY_REGION
  );

export const getPerpetratorArmedForceGroupPartyNames = state =>
  getDashboardByGroupAndName(
    state,
    DASHBOARD_GROUP.perpetrator_armed_force_group_party_names,
    DASHBOARD_NAMES.PERPETRATOR_ARMED_FORCE_GROUP_PARTY_NAMES
  );

export const getReportingLocation = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.reporting_location, DASHBOARD_NAMES.REPORTING_LOCATION);

export const getApprovalsAssessmentPending = state =>
  selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_ASSESSMENT_PENDING);

export const getApprovalsClosurePending = state =>
  selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_CLOSURE_PENDING);

export const getApprovalsCasePlanPending = state =>
  selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_CASE_PLAN_PENDING);

export const getApprovalsActionPlanPending = state =>
  selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_ACTION_PLAN_PENDING);

export const getApprovalsGbvClosurePending = state =>
  selectApprovalIndicator(state, DASHBOARD_NAMES.APPROVALS_GBV_CLOSURE_PENDING);

export const getProtectionConcerns = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.protection_concerns, DASHBOARD_NAMES.PROTECTION_CONCERNS);

export const getCasesByTaskOverdueAssessment = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overdue_tasks, DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_ASSESSMENT);

export const getCasesByTaskOverdueCasePlan = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overdue_tasks, DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_CASE_PLAN);

export const getCasesByTaskOverdueServices = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overdue_tasks, DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_SERVICES);

export const getCasesByTaskOverdueFollowups = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overdue_tasks, DASHBOARD_NAMES.CASES_BY_TASK_OVERDUE_FOLLOWUPS);

export const getSharedWithMe = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.referrals_transfers, DASHBOARD_NAMES.SHARED_WITH_ME);

export const getSharedWithOthers = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.referrals_transfers, DASHBOARD_NAMES.SHARED_WITH_OTHERS);

export const getGroupOverview = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overview, DASHBOARD_NAMES.GROUP_OVERVIEW);

export const getCaseOverview = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overview, DASHBOARD_NAMES.CASE_OVERVIEW);

export const getNationalAdminSummary = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overview, DASHBOARD_NAMES.NATIONAL_ADMIN_SUMMARY);

export const getSharedFromMyTeam = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.shared_from_my_team, DASHBOARD_NAMES.SHARED_FROM_MY_TEAM);

export const getSharedWithMyTeam = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.shared_with_my_team, DASHBOARD_NAMES.SHARED_WITH_MY_TEAM);

export const getCaseIncidentOverview = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.overview, DASHBOARD_NAMES.CASE_INCIDENT_OVERVIEW);

export const getCasesBySocialWorker = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.cases_by_social_worker, DASHBOARD_NAMES.CASES_BY_SOCIAL_WORKER);

export const getSharedWithMyTeamOverview = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.referrals_transfers, DASHBOARD_NAMES.SHARED_WITH_MY_TEAM_OVERVIEW);

export const getDashboardFlags = (state, excludeResolved = false) => {
  const flags = state.getIn(["records", NAMESPACE, "flags", "data"], fromJS([]));

  if (excludeResolved) {
    return flags.filter(flag => !flag.get("removed"));
  }

  return flags;
};

export const getDashboardFlagsTotal = state => state.getIn(["records", NAMESPACE, "flags", "metadata", "total"], 0);

export const getDashboardFlagsLoading = state => state.getIn(["records", NAMESPACE, "flags", "loading"], false);

export const getCasesToAssign = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.cases_to_assign, DASHBOARD_NAMES.CASES_TO_ASSIGN);

export const getActionNeededNewUpdated = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.action_needed, DASHBOARD_NAMES.ACTION_NEEDED_NEW_UPDATED);

export const getActionNeededNewReferrals = state =>
  getDashboardByGroupAndName(state, DASHBOARD_GROUP.action_needed, DASHBOARD_NAMES.ACTION_NEEDED_NEW_REFERRALS);

export const getActionNeededTransferAwaitingAcceptance = state =>
  getDashboardByGroupAndName(
    state,
    DASHBOARD_GROUP.action_needed,
    DASHBOARD_NAMES.ACTION_NEEDED_NEW_TRANSFER_AWAITING_ACCEPTANCE
  );

export const getIsDashboardGroupLoading = (state, group) => getDashboardsByGroup(state, group).get("loading", false);

export const getDashboardGroupHasData = (state, group) =>
  !getDashboardsByGroup(state, group).get("data", fromJS([])).isEmpty();
