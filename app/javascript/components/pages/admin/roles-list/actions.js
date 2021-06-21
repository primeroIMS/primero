import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../roles-form/namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_METADATA",
  "ROLES",
  "ROLES_STARTED",
  "ROLES_SUCCESS",
  "ROLES_FAILURE",
  "ROLES_FINISHED",
  "SET_ROLES_FILTER"
]);
