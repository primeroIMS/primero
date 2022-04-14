import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_INSIGHT",
  "FETCH_INSIGHT_STARTED",
  "FETCH_INSIGHT_SUCCESS",
  "FETCH_INSIGHT_FAILURE",
  "FETCH_INSIGHT_FINISHED",
  "SET_SUB_REPORT"
]);
