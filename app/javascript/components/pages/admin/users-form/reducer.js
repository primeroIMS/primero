import { fromJS } from "immutable";

import { SAVING } from "../../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USER_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false).set("serverErrors", fromJS([]));
    case actions.FETCH_USER_SUCCESS:
      return state.set("selectedUser", fromJS(payload.data)).set("errors", false).set("serverErrors", fromJS([]));
    case actions.FETCH_USER_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_USER_FAILURE:
    case actions.SAVE_USER_FAILURE:
      return state.set("errors", true).set("serverErrors", fromJS(payload.errors)).set(SAVING, false);
    case actions.CLEAR_SELECTED_USER:
      return state.set("selectedUser", fromJS({})).set("errors", false).set("serverErrors", fromJS([]));
    case actions.SAVE_USER_STARTED:
      return state.set(SAVING, true);
    case actions.SAVE_USER_SUCCESS:
      return state.set(SAVING, false);
    case actions.NEW_PASSWORD_RESET_REQUEST_STARTED:
      return state.setIn(["newPasswordReset", "saving"], true);
    case actions.NEW_PASSWORD_RESET_REQUEST_SUCCESS:
      return state.setIn(["newPasswordReset", "saving"], false);
    case actions.NEW_PASSWORD_RESET_REQUEST_FAILURE:
      return state.setIn(["newPasswordReset", "saving"], false);
    case actions.NEW_PASSWORD_RESET_REQUEST_FINISHED:
      return state.setIn(["newPasswordReset", "saving"], false);
    case actions.PASSWORD_RESET_REQUEST_STARTED:
      return state.setIn(["passwordResetRequest", "loading"], true);
    case actions.PASSWORD_RESET_REQUEST_SUCCESS:
      return state.setIn(["passwordResetRequest", "loading"], false);
    case actions.PASSWORD_RESET_REQUEST_FAILURE:
      return state.setIn(["passwordResetRequest", "loading"], false);
    case actions.PASSWORD_RESET_REQUEST_FINISHED:
      return state.setIn(["passwordResetRequest", "loading"], false);
    default:
      return state;
  }
};
