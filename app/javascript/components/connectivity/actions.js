import { namespaceActions } from "../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, [
  "NETWORK_STATUS",
  "PENDING_USER_LOGIN",
  "QUEUE_STATUS",
  "SERVER_STATUS",
  "SERVER_STATUS_FAILURE",
  "SERVER_STATUS_SUCCESS",
  "SET_QUEUE_DATA",
  "USER_TOGGLE_OFFLINE"
]);
