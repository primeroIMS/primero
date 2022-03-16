import { namespaceActions } from "../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, [
  "EXPORT_INSIGHTS",
  "EXPORT_INSIGHTS_FAILURE",
  "EXPORT_INSIGHTS_FINISHED",
  "EXPORT_INSIGHTS_STARTED",
  "EXPORT_INSIGHTS_SUCCESS"
]);
