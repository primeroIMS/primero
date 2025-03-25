import { METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG } from "../../../action-dialog";

import actions from "./actions";
import { USAGE_REPORTS_EXPORT_PATH } from "./constants";

export const fetchUsageExport = (params, message) => ({
  type: actions.FETCH_USAGE_REPORTS,
  api: {
    path: USAGE_REPORTS_EXPORT_PATH,
    method: METHODS.GET,
    params,
    successCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        },
        redirectWithIdFromResponse: false,
        redirect: false
      },
      {
        action: CLEAR_DIALOG
      }
    ]
  }
});

export const clearExportedUsageReport = () => ({
  type: actions.CLEAR_EXPORTED_USAGE_REPORT
});
