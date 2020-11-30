import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_USER_DATA",
  "FETCH_USER_DATA_SUCCESS",
  "LOGOUT",
  "LOGOUT_FAILURE",
  "LOGOUT_FINISHED",
  "LOGOUT_STARTED",
  "LOGOUT_SUCCESS",
  "LOGOUT_SUCCESS_CALLBACK",
  "REFRESH_USER_TOKEN",
  "SET_AUTHENTICATED_USER"
]);
