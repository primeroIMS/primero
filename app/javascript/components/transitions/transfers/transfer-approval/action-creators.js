import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import { APPROVE_TRANSFER } from "./actions";

export const approvalTransfer = ({
  body,
  message,
  recordId,
  transferId
}) => {
  return {
    type: APPROVE_TRANSFER,
    api: {
      path: `cases/${recordId}/transfers/${transferId}`,
      method: "PATCH",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        },
        redirectWithIdFromResponse: false,
        redirect: false
      }
    }
  };
};