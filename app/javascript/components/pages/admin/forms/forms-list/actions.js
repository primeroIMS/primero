import { namespaceActions } from "../../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "RECORD_FORMS",
  "RECORD_FORMS_STARTED",
  "RECORD_FORMS_SUCCESS",
  "RECORD_FORMS_FINISHED",
  "RECORD_FORMS_FAILURE"
]);
