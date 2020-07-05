import { RECORD_PATH } from "../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../notifier";

import actions from "./actions";

export const fetchReport = id => {
  return {
    type: actions.FETCH_REPORT,
    api: {
      path: `reports/${id}`
    }
  };
};

export const deleteReport = ({ id, message }) => ({
  type: actions.DELETE_REPORT,
  api: {
    path: `${RECORD_PATH.reports}/${id}`,
    method: "DELETE",
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: SNACKBAR_VARIANTS.success,
          key: generate.messageKey()
        }
      },
      redirectWithIdFromResponse: false,
      redirect: `/${RECORD_PATH.reports}`
    }
  }
});
