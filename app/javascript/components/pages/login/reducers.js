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
    case Actions.LOGIN:
      // TODO: Need to implement login from api
      return state.set("isAuthenticated", payload);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
