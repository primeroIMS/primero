import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../namespace";

export default namespaceActions(NAMESPACE, [
  "AGENCIES",
  "AGENCIES_STARTED",
  "AGENCIES_SUCCESS",
  "AGENCIES_FAILURE",
  "AGENCIES_FINISHED"
]);
