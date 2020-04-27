import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../forms-list/namespace";

export default namespaceActions(NAMESPACE, [
  "CLEAR_SELECTED_FORM",
  "SAVE_FORM",
  "SAVE_FORM_STARTED",
  "SAVE_FORM_FINISHED",
  "SAVE_FORM_SUCCESS",
  "SAVE_FORM_FAILURE"
]);
