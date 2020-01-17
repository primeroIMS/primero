import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const saveTransferRequest = (recordId, body, message) => ({
  type: actions.TRANSFER_REQUEST,
  api: {
    path: `${RECORD_PATH.cases}/${recordId}/${actions.TRANSFER_REQUEST_URL}`,
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
