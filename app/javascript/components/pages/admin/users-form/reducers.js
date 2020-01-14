import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USER_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", fromJS([]));
    case actions.FETCH_USER_SUCCESS:
      return state
        .set("selectedUser", fromJS(payload.data))
        .set("errors", fromJS([]));
    case actions.FETCH_USER_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_USER_FAILURE:
      return state.set("errors", fromJS([]));
    case actions.SAVE_USER_FAILURE:
      return state.set("errors", fromJS(payload.errors));
    case actions.CLEAR_SELECTED_USER:
      return state.set("selectedUser", fromJS({})).set("errors", fromJS([]));
    default:
      return state;
  }
};

export const reducers = reducer;
