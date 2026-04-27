import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "ACCEPT_TERMS_OF_USE",
  "ACCEPT_TERMS_OF_USE_FAILURE",
  "ACCEPT_TERMS_OF_USE_FINISHED",
  "ACCEPT_TERMS_OF_USE_STARTED",
  "ACCEPT_TERMS_OF_USE_SUCCESS"
]);
