import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.USERS_STARTED:
      return state.set("loading", true);
    case actions.USERS_SUCCESS:
      return state.set("data", fromJS(payload.data)).set("metadata", fromJS(payload.metadata));
    case actions.USERS_FINISHED:
      return state.set("loading", false);
    case actions.SET_USERS_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    case actions.DISABLE_USERS_STARTED:
      return state.setIn(["disableUsers", "loading"], true).setIn(["disableUsers", "errors"], false);
    case actions.DISABLE_USERS_FAILURE:
      return state.setIn(["disableUsers", "loading"], false).setIn(["disableUsers", "errors"], true);
    case actions.DISABLE_USERS_SUCCESS:
      return state.setIn(["disableUsers", "loading"], false).setIn(["disableUsers", "errors"], false);
    case actions.DISABLE_USERS_FINISHED:
      return state.setIn(["disableUsers", "loading"], false).setIn(["disableUsers", "errors"], false);
    case actions.SEND_EMAILS_STARTED:
      return state.setIn(["sendEmails", "loading"], true).setIn(["sendEmails", "errors"], false);
    case actions.SEND_EMAILS_FAILURE:
      return state.setIn(["sendEmails", "loading"], false).setIn(["sendEmails", "errors"], true);
    case actions.SEND_EMAILS_SUCCESS:
      return state.setIn(["sendEmails", "loading"], false).setIn(["sendEmails", "errors"], false);
    case actions.SEND_EMAILS_FINISHED:
      return state.setIn(["sendEmails", "loading"], false).setIn(["sendEmails", "errors"], false);
    default:
      return state;
  }
};
