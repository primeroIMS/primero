import { fromJS, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({
  module: "primero",
  agency: "unicef",
  isAuthenticated: false
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_STYLE:
      // TODO: Reuse reducer that sets module/agency when ready
      return state
        .set("module", fromJS(payload.module))
        .set("agency", fromJS(payload.agency));
    case Actions.LOGIN_STARTED:
      return state.set("messages", null);
    case Actions.SET_AUTH:
      return state
        .set("isAuthenticated", payload.auth)
        .set("username", payload.username);
    case Actions.LOGIN_SUCCESS:
      return state
        .set("isAuthenticated", true)
        .set("username", payload.user_name);
    case Actions.LOGIN_FAILURE:
      return state.set("messages", fromJS(payload));
    case Actions.LOGOUT_SUCCESS:
      return state.set("isAuthenticated", false).set("username", null);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
