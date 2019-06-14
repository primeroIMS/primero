import NAMESPACE from "./namespace";

export const selectFlags = state => {
  const flags = state.getIn([NAMESPACE, "flags"]);
  return flags ? flags.toJS() : [];
};

export const selectCasesByStatus = state => {
  const casesByStatus = state.getIn([NAMESPACE, "casesByStatus"]);
  return casesByStatus ? casesByStatus.toJS() : {};
};

export const getDoughnutInnerText = state => {
  const casesByStatus = selectCasesByStatus(state);
  const text = [];
  if (casesByStatus.open) {
    text.push({ text: `${casesByStatus.open} Open`, bold: true });
  }
  if (casesByStatus.closed) {
    text.push({ text: `${casesByStatus.closed} Closed` });
  }
  return text;
};

export const selectCasesByCaseWorker = state => {
  const casesByCaseWorker = state.getIn([NAMESPACE, "casesByCaseWorker"]);
  return casesByCaseWorker ? casesByCaseWorker.toJS() : {};
};

export const selectCasesRegistration = state => {
  const casesRegistration = state.getIn([NAMESPACE, "casesRegistration"]);
  return casesRegistration ? casesRegistration.toJS() : {};
};

export const selectCasesOverview = state => {
  const casesOverview = state.getIn([NAMESPACE, "casesOverview"]);
  return casesOverview ? casesOverview.toJS() : {};
};
