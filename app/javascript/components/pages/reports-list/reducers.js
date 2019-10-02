import { fromJS, Map } from "immutable";
import * as Actions from "./actions";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_REPORTS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case Actions.FETCH_REPORTS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata))
        .set("errors", false);
    case Actions.FETCH_REPORTS_FINISHED:
      return state.set("loading", fromJS(payload));
    case Actions.FETCH_REPORTS_FAILURE:
      return state.set("errors", true);
    default:
      return state;
  }
};

export const reducers = reducer;
