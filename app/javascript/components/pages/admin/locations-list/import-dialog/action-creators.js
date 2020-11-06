import { RECORD_PATH, METHODS } from "../../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../../notifier";
import { CLEAR_DIALOG } from "../../../../action-dialog";

import actions from "./actions";

export const importLocations = ({ body, message }) => ({
  type: actions.IMPORT_LOCATIONS,
  api: {
    path: `${RECORD_PATH.locations}/import`,
    method: METHODS.POST,
    body,
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
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
        redirect: `/admin/${RECORD_PATH.locations}`
      }
    ]
  }
});

export const clearImportErrors = () => ({
  type: actions.CLEAR_IMPORT_ERRORS
});
