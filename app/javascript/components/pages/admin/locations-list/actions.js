import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "LOCATIONS",
  "LOCATIONS_STARTED",
  "LOCATIONS_SUCCESS",
  "LOCATIONS_FAILURE",
  "LOCATIONS_FINISHED",
  "SET_LOCATIONS_FILTER"
]);
