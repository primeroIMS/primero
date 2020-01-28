import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

import actions from "./actions";

export const saveExport = (body, message) => ({
  type: actions.EXPORT,
  api: {
    path: "exports",
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});
