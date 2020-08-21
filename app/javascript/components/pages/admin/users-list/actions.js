import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_METADATA",
  "USERS",
  "USERS_FINISHED",
  "USERS_STARTED",
  "USERS_SUCCESS",
  "SET_USERS_FILTER"
]);
