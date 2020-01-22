import { DB } from "../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

import { APPROVE_RECORD } from "./actions";

export const approvalRecord = ({
  recordType,
  recordId,
  approvalId,
  body,
  message,
  redirect
}) => {
  return {
    type: `${recordType}/${APPROVE_RECORD}`,
    api: {
      path: `${recordType}/${recordId}/approvals/${approvalId}`,
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
        redirect: redirect === false ? false : redirect || `/${recordType}`
      }
    }
  };
};
