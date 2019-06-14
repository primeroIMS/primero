import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectFlags = state => {
  return state.getIn([NAMESPACE, "flags"], fromJS([]));
};

export const selectCasesByStatus = state => {
  return state.getIn([NAMESPACE, "casesByStatus"], fromJS({}));
};

export const getDoughnutInnerText = state => {
  const casesByStatus = selectCasesByStatus(state);
  const text = [];
  const openCases = casesByStatus.get("open");
  const closedCases = casesByStatus.get("closed");
  if (openCases) {
    text.push({ text: `${openCases} Open`, bold: true });
  }
  if (closedCases) {
    text.push({ text: `${closedCases} Closed` });
  }
  return text;
};

export const selectCasesByCaseWorker = state => {
  return state.getIn([NAMESPACE, "casesByCaseWorker"], fromJS({}));
};

export const selectCasesRegistration = state => {
  return state.getIn([NAMESPACE, "casesRegistration"], fromJS({}));
};

export const selectCasesOverview = state => {
  return state.getIn([NAMESPACE, "casesOverview"], fromJS({}));
};
