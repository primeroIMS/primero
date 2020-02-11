import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const approvalTransfer = ({
  body,
  message,
  recordId,
  recordType,
  transferId
}) => {
  return {
    type: actions.APPROVE_TRANSFER,
    api: {
      path: `${recordType}/${recordId}/transfers/${transferId}`,
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