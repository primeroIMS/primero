import { namespaceActions } from "libs";
import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "FETCH_SYSTEM_SETTINGS",
  "FETCH_SYSTEM_SETTINGS_SUCCESS",
  "SET_USER_IDLE",
  "NETWORK_STATUS"
]);
