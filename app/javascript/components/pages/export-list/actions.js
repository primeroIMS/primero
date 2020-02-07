import { namespaceActions } from "../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_EXPORTS",
  "FETCH_EXPORTS_STARTED",
  "FETCH_EXPORTS_SUCCESS",
  "FETCH_EXPORTS_FINISHED",
  "FETCH_EXPORTS_FAILURE"
]);
