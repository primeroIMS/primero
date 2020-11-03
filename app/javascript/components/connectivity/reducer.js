import { fromJS } from "immutable";

import actions from "./actions";
import { NAMESPACE } from "./constants";

const DEFAULT_STATE = fromJS({
  online: window.navigator.onLine,
  serverOnline: true
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.NETWORK_STATUS:
      return state.set("online", payload);
    case actions.SERVER_STATUS:
      return state.set("serverOnline", payload);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
