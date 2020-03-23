import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USER_GROUP_STARTED:
      return state
        .set("loading", fromJS(payload))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_USER_GROUP_SUCCESS:
      return state
        .set("selectedUserGroup", fromJS(payload.data))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.FETCH_USER_GROUP_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_USER_GROUP_FAILURE:
    case actions.SAVE_USER_GROUP_FAILURE:
      return state
        .set("errors", true)
        .set("serverErrors", fromJS(payload.errors));
    case actions.CLEAR_SELECTED_USER_GROUP:
      return state
        .set("selectedUserGroup", fromJS({}))
        .set("errors", false)
        .set("serverErrors", fromJS([]));
    case actions.SAVE_USER_GROUP_STARTED:
      return state.set("saving", true);
    case actions.SAVE_USER_GROUP_FINISHED:
      return state.set("saving", false);
    default:
      return state;
  }
};

export const reducers = reducer;
