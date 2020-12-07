import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "LOGIN",
  "LOGIN_SUCCESS",
  "LOGIN_STARTED",
  "LOGIN_FAILURE",
  "LOGIN_FINISHED"
]);
