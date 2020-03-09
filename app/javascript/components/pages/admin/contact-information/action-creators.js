import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const saveContactInformation = ({ id, body, saveMethod, message }) => {
  return {
    type: actions.SAVE_CONTACT_INFORMATION,
    api: {
      path: `${RECORD_PATH.contact_information}/${id}`,
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
        redirectWithIdFromResponse: saveMethod !== "update",
        redirect: `/admin/${RECORD_PATH.contact_information}`
      }
    }
  };
};
