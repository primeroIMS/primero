import { namespaceActions } from "../../../../libs";
import NAMESPACE from "../namespace";

import agencyNamespace from "./namespace";

const userActions = namespaceActions(NAMESPACE, [
  "AGENCIES",
  "AGENCIES_STARTED",
  "AGENCIES_SUCCESS",
  "AGENCIES_FAILURE",
  "AGENCIES_FINISHED"
]);

const agencyActions = namespaceActions(agencyNamespace, ["CLEAR_METADATA"]);

export default {
  ...userActions,
  ...agencyActions
};
