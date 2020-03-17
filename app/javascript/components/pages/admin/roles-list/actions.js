import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "ROLES",
  "ROLES_STARTED",
  "ROLES_SUCCESS",
  "ROLES_FAILURE",
  "ROLES_FINISHED"
]);
