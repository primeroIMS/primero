import { fromJS } from "immutable";
import NAMESPACE from "./namespace";

export const selectCasesByNationality = state => {
  return state.getIn(["records", NAMESPACE, "casesByNationality"], fromJS({}));
};

export const selectCasesByAgeAndSex = state => {
  return state.getIn(["records", NAMESPACE, "casesByAgeAndSex"], fromJS({}));
};

export const selectCasesByProtectionConcern = state => {
  return state.getIn(
    ["records", NAMESPACE, "casesByProtectionConcern"],
    fromJS({})
  );
};

export const selectCasesByAgency = state => {
  return state.getIn(["records", NAMESPACE, "casesByAgency"], fromJS({}));
};

export const selectReport = (state, reportName) => {
  return state.getIn(["records", NAMESPACE, reportName], fromJS({}));
};
