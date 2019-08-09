import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.CASES_BY_NATIONALITY:
      return state.set(
        "casesByNationality",
        fromJS(payload.casesByNationality)
      );
    case Actions.CASES_BY_AGENCY:
      return state.set("casesByAgency", fromJS(payload.casesByAgency));
    case Actions.CASES_BY_AGE_AND_SEX:
      return state.set("casesByAgeAndSex", fromJS(payload.casesByAgeAndSex));
    case Actions.CASES_BY_PROTECTION_CONCERN:
      return state.set(
        "casesByProtectionConcern",
        fromJS(payload.casesByProtectionConcern)
      );
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
