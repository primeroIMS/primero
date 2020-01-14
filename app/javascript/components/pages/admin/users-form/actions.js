import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_USER",
  "FETCH_USER",
  "FETCH_USER_STARTED",
  "FETCH_USER_SUCCESS",
  "FETCH_USER_FINISHED",
  "FETCH_USER_FAILURE",
  "SAVE_USER",
  "SAVE_USER_STARTED",
  "SAVE_USER_FINISHED",
  "SAVE_USER_SUCCESS",
  "SAVE_USER_FAILURE"
]);
