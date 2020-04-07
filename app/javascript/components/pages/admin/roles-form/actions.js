import { namespaceActions } from "../../../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_ROLE",
  "FETCH_ROLE",
  "FETCH_ROLE_FAILURE",
  "FETCH_ROLE_FINISHED",
  "FETCH_ROLE_STARTED",
  "FETCH_ROLE_SUCCESS",
  "SAVE_ROLE",
  "SAVE_ROLE_FAILURE",
  "SAVE_ROLE_FINISHED",
  "SAVE_ROLE_STARTED",
  "SAVE_ROLE_SUCCESS"
]);
