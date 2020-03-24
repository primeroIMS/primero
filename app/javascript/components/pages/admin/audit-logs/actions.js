import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_AUDIT_LOGS",
  "FETCH_AUDIT_LOGS_STARTED",
  "FETCH_AUDIT_LOGS_SUCCESS",
  "FETCH_AUDIT_LOGS_FAILURE",
  "FETCH_AUDIT_LOGS_FINISHED"
]);
