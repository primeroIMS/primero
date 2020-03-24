import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_AUDIT_LOGS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    // TODO: Remove line 12, added for testing purposes
    case actions.FETCH_AUDIT_LOGS:
    case actions.FETCH_AUDIT_LOGS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case actions.FETCH_AUDIT_LOGS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.FETCH_AUDIT_LOGS_FINISHED:
      return state.set("errors", false).set("loading", false);
    default:
      return state;
  }
};

export const reducers = reducer;
