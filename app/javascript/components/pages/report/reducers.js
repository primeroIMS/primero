import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_REPORT_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case Actions.FETCH_REPORT_SUCCESS:
      return state
        .set("selectedReport", fromJS(payload.data))
        .set("errors", false);
    case Actions.FETCH_REPORT_FINISHED:
      return state.set("loading", fromJS(payload));
    case Actions.FETCH_REPORT_FAILURE:
      return state.set("errors", true);
    default:
      return state;
  }
};

export const reducers = reducer;
