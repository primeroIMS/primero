import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_ROLE_STARTED:
      return state
        .set("loading", true)
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_ROLE_SUCCESS:
      return state
        .set("selectedRole", fromJS(payload.data))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_ROLE_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_ROLE_FAILURE:
    case actions.SAVE_ROLE_FAILURE:
      return state
        .set("errors", true)
        .set("serverErrors", fromJS(payload.errors));
    case actions.SAVE_ROLE_STARTED:
      return state.set("saving", true);
    case actions.SAVE_ROLE_FINISHED:
      return state.set("saving", false);
    case actions.CLEAR_SELECTED_ROLE:
      return state
        .set("selectedRole", fromJS({}))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    default:
      return state;
  }
};
