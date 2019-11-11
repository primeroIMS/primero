import { fromJS } from "immutable";

import {
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_STARTED,
  FETCH_REPORTS_FINISHED,
  FETCH_REPORTS_FAILURE
} from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_REPORTS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case FETCH_REPORTS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata))
        .set("errors", false);
    case FETCH_REPORTS_FINISHED:
      return state.set("loading", fromJS(payload));
    case FETCH_REPORTS_FAILURE:
      return state.set("errors", true);
    default:
      return state;
  }
};

export const reducers = reducer;
