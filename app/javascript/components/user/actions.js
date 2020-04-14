import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "SET_AUTHENTICATED_USER",
  "FETCH_USER_DATA",
  "FETCH_USER_DATA_SUCCESS",
  "LOGOUT",
  "LOGOUT_STARTED",
  "LOGOUT_SUCCESS",
  "LOGOUT_FINISHED",
  "LOGOUT_FAILURE",
  "LOGOUT_SUCCESS_CALLBACK",
  "REFRESH_USER_TOKEN"
]);
