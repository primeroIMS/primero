import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.USERS_STARTED:
      return state.set("loading", true);
    case actions.USERS_SUCCESS:
      return state
        .set("data", fromJS(payload.data))
        .set("metadata", fromJS(payload.metadata));
    case actions.USERS_FINISHED:
      return state.set("loading", false);
    case actions.SET_USERS_FILTER:
      return state.set("filters", fromJS(payload));
    default:
      return state;
  }
};
