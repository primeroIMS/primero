import { namespaceActions } from "../../libs";

import { NAMESPACE } from "./constants";

export default namespaceActions(NAMESPACE, [
  "REGISTER",
  "REGISTER_STARTED",
  "REGISTER_SUCCESS",
  "REGISTER_FINISHED",
  "REGISTER_FAILURE",
  "REGISTER_SUCCESS_CALLBACK",
  "REGISTER_SUCCESS_REDIRECT"
]);
