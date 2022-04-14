import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_INSIGHT_STARTED:
      return state.set("loading", true).set("errors", false).set("selectedReport", fromJS({}));
    case actions.FETCH_INSIGHT_SUCCESS:
      return state.set("selectedReport", fromJS(payload.data)).set("errors", false);
    case actions.FETCH_INSIGHT_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_INSIGHT_FAILURE:
      return state.set("errors", true);
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    case actions.SET_SUB_REPORT:
      return state.setIn(["filters", "subreport"], payload);
    default:
      return state;
  }
};
