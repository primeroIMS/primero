import { Map } from "immutable";

import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.LOGIN_STARTED:
      return state.set("error", null);
    case Actions.LOGIN_FAILURE:
      return state.set("error", payload.error);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
