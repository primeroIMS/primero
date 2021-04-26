import { namespaceActions } from "../../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_IMPORT_ERRORS",
  "IMPORT_LOCATIONS",
  "IMPORT_LOCATIONS_STARTED",
  "IMPORT_LOCATIONS_SUCCESS",
  "IMPORT_LOCATIONS_FINISHED",
  "IMPORT_LOCATIONS_FAILURE"
]);
