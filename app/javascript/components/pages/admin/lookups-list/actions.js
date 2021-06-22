import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_METADATA",
  "FETCH_LOOKUPS",
  "FETCH_LOOKUPS_STARTED",
  "FETCH_LOOKUPS_SUCCESS",
  "FETCH_LOOKUPS_FAILURE",
  "FETCH_LOOKUPS_FINISHED",
  "SET_LOOKUPS_FILTER"
]);
