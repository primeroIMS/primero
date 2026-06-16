import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../agencies-list/namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_AGENCY",
  "FETCH_AGENCY",
  "FETCH_AGENCY_STARTED",
  "FETCH_AGENCY_SUCCESS",
  "FETCH_AGENCY_FINISHED",
  "FETCH_AGENCY_FAILURE",
  "SAVE_AGENCY",
  "SAVE_AGENCY_STARTED",
  "SAVE_AGENCY_FINISHED",
  "SAVE_AGENCY_SUCCESS",
  "SAVE_AGENCY_FAILURE"
]);
