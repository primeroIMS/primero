import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_METADATA",
  "SET_USER_GROUPS_FILTER",
  "USER_GROUPS",
  "USER_GROUPS_STARTED",
  "USER_GROUPS_SUCCESS",
  "USER_GROUPS_FAILURE",
  "USER_GROUPS_FINISHED"
]);
