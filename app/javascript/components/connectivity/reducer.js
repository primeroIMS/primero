import { fromJS } from "immutable";

import { QUEUE_PENDING } from "../../libs/queue";

import actions from "./actions";
import { NAMESPACE } from "./constants";

const DEFAULT_STATE = fromJS({
  online: window.navigator.onLine,
  serverOnline: true,
  pendingUserLogin: false,
  queueStatus: QUEUE_PENDING,
  serverStatusRetries: 0
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.NETWORK_STATUS: {
      if (!payload) {
        return state.set("online", payload).set("serverOnline", payload);
      }

      return state.set("online", payload);
    }
    case actions.SERVER_STATUS_SUCCESS:
      return state.set("serverOnline", true).set("serverStatusRetries", 0);
    case actions.SERVER_STATUS_FAILURE:
      return state.set("serverOnline", false).set("serverStatusRetries", state.get("serverStatusRetries", 0) + 1);
    case actions.QUEUE_STATUS:
      return state.set("queueStatus", payload);
    case actions.PENDING_USER_LOGIN:
      return state.set("pendingUserLogin", payload);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
