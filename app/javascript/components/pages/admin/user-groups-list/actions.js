import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "USER_GROUPS",
  "USER_GROUPS_STARTED",
  "USER_GROUPS_SUCCESS",
  "USER_GROUPS_FAILURE",
  "USER_GROUPS_FINISHED"
]);
