import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import {
  SET_DIALOG,
  SET_DIALOG_PENDING
} from "../../../record-actions/actions";

import actions from "./actions";

export const fetchUser = id => {
  return {
    type: actions.FETCH_USER,
    api: {
      path: `${RECORD_PATH.users}/${id}`
    }
  };
};

export const saveUser = ({
  id,
  body,
  dialogName,
  saveMethod,
  message,
  failureMessage
}) => {
  console.log('body:', body);
  return {
    type: actions.SAVE_USER,
    api: {
      path:
        saveMethod === "update"
          ? `${RECORD_PATH.users}/${id}`
          : RECORD_PATH.users,
      method: saveMethod === "update" ? "PATCH" : "POST",
      body,
      successCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message,
            options: {
              variant: "success",
              key: generate.messageKey()
            }
          },

          redirectWithIdFromResponse: saveMethod !== "update",
          redirect: `/admin/${RECORD_PATH.users}`
        },
        {
          action: SET_DIALOG,
          payload: {
            dialog: dialogName,
            open: false
          }
        },
        {
          action: SET_DIALOG_PENDING,
          payload: {
            pending: false
          }
        }
      ],
      failureCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: failureMessage,
            options: {
              variant: "error",
              key: generate.messageKey()
            }
          }
        },
        {
          action: SET_DIALOG_PENDING,
          payload: {
            pending: false
          }
        }
      ]
    }
  };
};

export const clearSelectedUser = () => {
  return {
    type: actions.CLEAR_SELECTED_USER
  };
};
