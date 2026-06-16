import { fromJS } from "immutable";

import { SAVING } from "../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_CURRENT_USER_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false).set("serverErrors", fromJS([]));
    case actions.FETCH_CURRENT_USER_SUCCESS:
      return state.merge(payload.data).set("errors", false).set("serverErrors", fromJS([]));
    case actions.FETCH_CURRENT_USER_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_CURRENT_USER_FAILURE:
    case actions.UPDATE_CURRENT_USER_FAILURE:
      return state.set("errors", true).set(SAVING, false).set("serverErrors", fromJS(payload.errors));
    case actions.CLEAR_CURRENT_USER:
      return state.set("user", fromJS({})).set("errors", false).set("serverErrors", fromJS([]));
    case actions.UPDATE_CURRENT_USER_STARTED:
      return state.set(SAVING, true);
    case actions.UPDATE_CURRENT_USER_SUCCESS:
      return state.set(SAVING, false);
    default:
      return state;
  }
};
