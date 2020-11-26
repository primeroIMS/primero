import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_CHANGE_LOGS",
  "FETCH_CHANGE_LOGS_STARTED",
  "FETCH_CHANGE_LOGS_SUCCESS",
  "FETCH_CHANGE_LOGS_FAILURE",
  "FETCH_CHANGE_LOGS_FINISHED"
]);
