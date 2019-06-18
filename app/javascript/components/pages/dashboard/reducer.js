/* eslint-disable import/prefer-default-export */
import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.DASHBOARD_FLAGS:
      return state.set("flags", fromJS(payload));
    case Actions.CASES_BY_STATUS:
      return state.set("casesByStatus", fromJS(payload.casesByStatus));
    case Actions.CASES_BY_CASE_WORKER:
      return state.set("casesByCaseWorker", fromJS(payload.casesByCaseWorker));
    case Actions.CASES_REGISTRATION:
      return state.set("casesRegistration", fromJS(payload.casesRegistration));
    case Actions.CASES_OVERVIEW:
      return state.set("casesOverview", fromJS(payload.casesOverview));
    case Actions.OPEN_PAGE_ACTIONS:
      return state.set("isOpenPageActions", fromJS(payload));
    default:
      return state;
  }
};

export const dashboardReducers = { [NAMESPACE]: reducer };
