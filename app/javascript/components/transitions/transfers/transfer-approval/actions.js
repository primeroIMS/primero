import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "APPROVE_TRANSFER",
  "APPROVE_TRANSFER_STARTED",
  "APPROVE_TRANSFER_SUCCESS",
  "APPROVE_TRANSFER_FINISHED",
  "APPROVE_TRANSFER_FAILURE"
]);