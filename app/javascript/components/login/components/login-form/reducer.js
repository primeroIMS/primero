import { fromJS } from "immutable";

import actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.LOGIN_STARTED:
      return state.set("error", null);
    case actions.LOGIN_FAILURE:
      return state.set("error", payload.error);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
