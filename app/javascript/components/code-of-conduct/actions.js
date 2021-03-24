import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "ACCEPT_CODE_OF_CONDUCT",
  "ACCEPT_CODE_OF_CONDUCT_FAILURE",
  "ACCEPT_CODE_OF_CONDUCT_FINISHED",
  "ACCEPT_CODE_OF_CONDUCT_STARTED",
  "ACCEPT_CODE_OF_CONDUCT_SUCCESS"
]);
