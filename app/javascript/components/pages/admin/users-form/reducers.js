import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USER_STARTED:
      return state
        .set("loading", fromJS(payload))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_USER_SUCCESS:
      return state
        .set("selectedUser", fromJS(payload.data))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_USER_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_USER_FAILURE:
    case actions.SAVE_USER_FAILURE:
      return state
        .set("errors", true)
        .set("serverErrors", fromJS(payload.errors));
    case actions.CLEAR_SELECTED_USER:
      return state
        .set("selectedUser", fromJS({}))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.SAVE_USER_STARTED:
      return state.set("saving", true);
    case actions.SAVE_USER_SUCCESS:
      return state.set("saving", false);
    default:
      return state;
  }
};
