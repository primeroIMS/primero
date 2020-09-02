import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_CONFIGURATIONS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_CONFIGURATIONS_SUCCESS:
      return state.set("data", fromJS(payload.data)).set("metadata", fromJS(payload.metadata));
    case actions.FETCH_CONFIGURATIONS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.FETCH_CONFIGURATIONS_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    default:
      return state;
  }
};
