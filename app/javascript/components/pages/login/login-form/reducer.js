import { fromJS } from "immutable";

import { LOGIN_STARTED, LOGIN_FAILURE } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case LOGIN_STARTED:
      return state.set("error", null);
    case LOGIN_FAILURE:
      return state.set("error", payload.error);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
