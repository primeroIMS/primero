import { fromJS } from "immutable";

import {
  FETCH_REPORT_STARTED,
  FETCH_REPORT_SUCCESS,
  FETCH_REPORT_FINISHED,
  FETCH_REPORT_FAILURE
} from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_REPORT_STARTED:
      return state
        .set("loading", fromJS(payload))
        .set("errors", false)
        .set("selectedReport", fromJS({}));
    case FETCH_REPORT_SUCCESS:
      return state
        .set("selectedReport", fromJS(payload.data))
        .set("errors", false);
    case FETCH_REPORT_FINISHED:
      return state.set("loading", fromJS(payload));
    case FETCH_REPORT_FAILURE:
      return state.set("errors", true);
    case "user/LOGOUT_SUCCESS":
      return DEFAULT_STATE;
    default:
      return state;
  }
};

export const reducers = reducer;
