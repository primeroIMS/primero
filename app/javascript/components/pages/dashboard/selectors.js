import { fromJS } from "immutable";

import { DASHBOARD_NAMES } from "./constants";
import NAMESPACE from "./namespace";

export const selectFlags = state => {
  return state.getIn(["records", NAMESPACE, "flags"], fromJS({}));
};

export const selectCasesByStatus = state => {
  return state.getIn(["records", NAMESPACE, "casesByStatus"], fromJS({}));
};

export const selectCasesByCaseWorker = state => {
  return state.getIn(["records", NAMESPACE, "casesByCaseWorker"], fromJS([]));
};

export const selectCasesRegistration = state => {
  return state.getIn(["records", NAMESPACE, "casesRegistration"], fromJS({}));
};

export const selectCasesOverview = state => {
  return state.getIn(["records", NAMESPACE, "casesOverview"], fromJS({}));
};

export const selectServicesStatus = state => {
  return state.getIn(["records", NAMESPACE, "servicesStatus"], fromJS({}));
};

export const selectIsOpenPageActions = state => {
  return state.getIn(["records", NAMESPACE, "isOpenPageActions"], false);
};

export const getDashboards = state => {
  return state.getIn(["records", NAMESPACE, "data"], false);
};

export const getDashboardByName = (state, name) => {
  const currentState = getDashboards(state);
  const noDashboard = fromJS({});

  if (!currentState) {
    return noDashboard;
  }
  const dashboardData = currentState
    .filter(f => f.get("name") === name)
    .first();

  return dashboardData?.size ? dashboardData : noDashboard;
};

export const getCasesByAssessmentLevel = state => {
  const currentState = getDashboards(state);

  if (!currentState) {
    return fromJS([]);
  }
  const dashboardData = currentState
    .filter(f => f.get("name") === DASHBOARD_NAMES.CASE_RISK)
    .first();

  return dashboardData?.size ? dashboardData : fromJS([]);
};

export const getWorkflowIndividualCases = state => {
  return getDashboardByName(state, DASHBOARD_NAMES.WORKFLOW).deleteIn([
    "stats",
    "closed"
  ]);
};

export const getApprovalsAssessment = state =>
  getDashboardByName(state, DASHBOARD_NAMES.APPROVALS_ASSESSMENT);

export const getApprovalsCasePlan = state =>
  getDashboardByName(state, DASHBOARD_NAMES.APPROVALS_CASE_PLAN);

export const getApprovalsClosure = state =>
  getDashboardByName(state, DASHBOARD_NAMES.APPROVALS_CLOSURE);

export const getWorkflowTeamCases = state =>
  getDashboardByName(state, DASHBOARD_NAMES.WORKFLOW_TEAM);
