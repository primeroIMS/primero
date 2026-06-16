import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS, generate } from "../../notifier";
import { RECORD_PATH, METHODS } from "../../../config";

import actions from "./actions";

export const fetchCurrentUser = id => {
  return {
    type: actions.FETCH_CURRENT_USER,
    api: {
      path: `${RECORD_PATH.users}/${id}`
    }
  };
};

export const clearCurrentUser = () => {
  return {
    type: actions.CLEAR_CURRENT_USER
  };
};

export const updateUserAccount = ({ id, data, message }) => ({
  type: actions.UPDATE_CURRENT_USER,
  api: {
    path: `${RECORD_PATH.users}/${id}`,
    method: METHODS.PATCH,
    body: { data },
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: SNACKBAR_VARIANTS.success,
          key: generate.messageKey(message)
        }
      },
      redirectWithIdFromResponse: false,
      redirect: `/${RECORD_PATH.account}/${id}`
    }
  }
});
