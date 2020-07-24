import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.USER_GROUPS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.USER_GROUPS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case actions.USER_GROUPS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.USER_GROUPS_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    default:
      return state;
  }
};
