import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../lookups-list/namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_LOOKUP",
  "FETCH_LOOKUP",
  "FETCH_LOOKUP_FAILURE",
  "FETCH_LOOKUP_FINISHED",
  "FETCH_LOOKUP_STARTED",
  "FETCH_LOOKUP_SUCCESS",
  "SAVE_LOOKUP",
  "SAVE_LOOKUP_FAILURE",
  "SAVE_LOOKUP_FINISHED",
  "SAVE_LOOKUP_STARTED",
  "SAVE_LOOKUP_SUCCESS"
]);
