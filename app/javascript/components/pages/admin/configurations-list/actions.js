import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_METADATA",
  "FETCH_CONFIGURATIONS",
  "FETCH_CONFIGURATIONS_STARTED",
  "FETCH_CONFIGURATIONS_SUCCESS",
  "FETCH_CONFIGURATIONS_FAILURE",
  "FETCH_CONFIGURATIONS_FINISHED"
]);
