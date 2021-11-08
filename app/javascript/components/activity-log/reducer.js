import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FECTH_ACTIVITY_LOGS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.FECTH_ACTIVITY_LOGS_SUCCESS:
      return state.set("data", fromJS(payload.data)).set("metadata", fromJS(payload.metadata));
    case actions.FECTH_ACTIVITY_LOGS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.FECTH_ACTIVITY_LOGS_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.SET_ACTIVITY_LOGS_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    default:
      return state;
  }
};
