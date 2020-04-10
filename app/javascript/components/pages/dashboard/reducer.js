import { fromJS, Map } from "immutable";

import {
  DASHBOARD_FLAGS,
  CASES_BY_STATUS,
  CASES_BY_CASE_WORKER,
  CASES_REGISTRATION,
  CASES_OVERVIEW,
  DASHBOARDS_STARTED,
  DASHBOARDS_SUCCESS,
  DASHBOARDS_FINISHED,
  DASHBOARDS_FAILURE,
  SERVICES_STATUS,
  OPEN_PAGE_ACTIONS
} from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case DASHBOARD_FLAGS:
      return state.set("flags", fromJS(payload));
    case CASES_BY_STATUS:
      return state.set("casesByStatus", fromJS(payload.casesByStatus));
    case CASES_BY_CASE_WORKER:
      return state.set("casesByCaseWorker", fromJS(payload.casesByCaseWorker));
    case CASES_REGISTRATION:
      return state.set("casesRegistration", fromJS(payload.casesRegistration));
    case CASES_OVERVIEW:
      return state.set("casesOverview", fromJS(payload.casesOverview));
    case DASHBOARDS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case DASHBOARDS_SUCCESS:
      return state.set("data", fromJS(payload.data));
    case DASHBOARDS_FINISHED:
      return state.set("loading", fromJS(payload));
    case DASHBOARDS_FAILURE:
      return state.set("errors", true);
    case SERVICES_STATUS:
      return state.set("servicesStatus", fromJS(payload.services));
    case OPEN_PAGE_ACTIONS:
      return state.set("isOpenPageActions", fromJS(payload));
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
