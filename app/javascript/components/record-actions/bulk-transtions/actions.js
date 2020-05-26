import { namespaceActions } from "../../../libs";

import NAMESPACE from "./namespace";

const actions = namespaceActions(NAMESPACE, [
  "BULK_ASSIGN_USER_SAVE",
  "BULK_ASSIGN_USER_SAVE_SUCCESS",
  "BULK_ASSIGN_USER_SAVE_STARTED",
  "BULK_ASSIGN_USER_SAVE_FAILURE",
  "BULK_ASSIGN_USER_SAVE_FINISHED"
]);

export default {
  ...actions,
  BULK_ASSIGN: "cases/assigns"
};
