import { namespaceActions } from "../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, [
  "NETWORK_STATUS",
  "SERVER_STATUS",
  "SERVER_STATUS_SUCCESS",
  "SERVER_STATUS_FAILURE",
  "QUEUE_STATUS",
  "PENDING_USER_LOGIN"
]);
