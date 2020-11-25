import { fromJS } from "immutable";

import { QUEUE_PENDING } from "../../libs/queue";

import actions from "./actions";
import { NAMESPACE } from "./constants";

const DEFAULT_STATE = fromJS({
  online: window.navigator.onLine,
  serverOnline: true,
  pendingUserLogin: false,
  queueStatus: QUEUE_PENDING
});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.NETWORK_STATUS:
      return state.set("online", payload);
    case actions.SERVER_STATUS:
      return state.set("serverOnline", payload);
    case actions.QUEUE_STATUS:
      return state.set("queueStatus", payload);
    case actions.PENDING_USER_LOGIN:
      return state.set("pendingUserLogin", payload);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
