import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "REVOKE_TRANSITION",
  "REVOKE_TRANSITION_STARTED",
  "REVOKE_TRANSITION_SUCCESS",
  "REVOKE_TRANSITION_FINISHED",
  "REVOKE_TRANSITION_FAILURE"
]);
