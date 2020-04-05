import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "SAVE_CONTACT_INFORMATION",
  "SAVE_CONTACT_INFORMATION_STARTED",
  "SAVE_CONTACT_INFORMATION_FINISHED",
  "SAVE_CONTACT_INFORMATION_SUCCESS",
  "SAVE_CONTACT_INFORMATION_FAILURE"
]);
