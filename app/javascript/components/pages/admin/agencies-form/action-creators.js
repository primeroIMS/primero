import { RECORD_PATH, SAVE_METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchAgency = id => {
  return {
    type: actions.FETCH_AGENCY,
    api: {
      path: `${RECORD_PATH.agencies}/${id}`
    }
  };
};

export const saveAgency = ({ id, body, saveMethod, message }) => {
  const path =
    saveMethod === SAVE_METHODS.update
      ? `${RECORD_PATH.agencies}/${id}`
      : RECORD_PATH.agencies;

  return {
    type: actions.SAVE_AGENCY,
    api: {
      path,
      method: saveMethod === SAVE_METHODS.update ? "PATCH" : "POST",
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
        redirectWithIdFromResponse: saveMethod !== SAVE_METHODS.update,
        redirect: `/admin/${path}`
      }
    }
  };
};

export const clearSelectedAgency = () => {
  return {
    type: actions.CLEAR_SELECTED_AGENCY
  };
};
