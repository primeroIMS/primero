import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "REFERRAL_DONE",
  "REFERRAL_DONE_STARTED",
  "REFERRAL_DONE_SUCCESS",
  "REFERRAL_DONE_FINISHED",
  "REFERRAL_DONE_FAILURE"
]);
