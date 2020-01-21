import { DB, RECORD_PATH } from "../../../config";
import { ENQUEUE_SNACKBAR } from "../../notifier";

import * as Actions from "./actions";

export const approvalRecord = (
  recordType,
  recordId,
  approvalId,
  body,
  message,
  redirect
) => async dispatch => {
  await dispatch({
    type: `${recordType}/${Actions.APPROVE_RECORD}`,
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
            key: new Date().getTime() + Math.random()
          }
        },
        redirectWithIdFromResponse: false,
        redirect: redirect === false ? false : redirect || `/${recordType}`
      },
      db: {
        collection: DB.RECORDS,
        recordType
      }
    }
  });
};
