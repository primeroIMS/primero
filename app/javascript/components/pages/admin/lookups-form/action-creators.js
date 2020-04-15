import { RECORD_PATH, SAVE_METHODS, METHODS } from "../../../../config";
import {
  ENQUEUE_SNACKBAR,
  generate,
  SNACKBAR_VARIANTS
} from "../../../notifier";

import actions from "./actions";

export const fetchLookup = id => {
  const path = `${RECORD_PATH.lookups}/${id}`;

  return {
    type: actions.FETCH_LOOKUP,
    api: {
      path
    }
  };
};

export const saveLookup = ({ id, body, saveMethod, message }) => {
  const path =
    saveMethod === SAVE_METHODS.update
      ? `${RECORD_PATH.lookups}/${id}`
      : RECORD_PATH.lookups;

  return {
    type: actions.SAVE_LOOKUP,
    api: {
      path,
      method: saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST,
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: generate.messageKey()
          }
        },
        redirectWithIdFromResponse: saveMethod !== "update",
        redirect: `/admin/${path}`
      }
    }
  };
};

export const clearSelectedLookup = () => ({
  type: actions.CLEAR_SELECTED_LOOKUP
});
