import { RECORD_PATH } from "../../../../config";
import {
  ENQUEUE_SNACKBAR,
  generate,
  SNACKBAR_VARIANTS
} from "../../../notifier";

import actions from "./actions";

export const fetchRole = id => ({
  type: actions.FETCH_ROLE,
  api: {
    path: `${RECORD_PATH.roles}/${id}`
  }
});

export const saveRole = ({ id, body, saveMethod, message }) => ({
  type: actions.SAVE_ROLE,
  api: {
    path:
      saveMethod === "update"
        ? `${RECORD_PATH.roles}/${id}`
        : RECORD_PATH.roles,
    method: saveMethod === "update" ? "PATCH" : "POST",
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
      redirect: `/admin/${
        saveMethod === "update"
          ? `${RECORD_PATH.roles}/${id}`
          : RECORD_PATH.roles
      }`
    }
  }
});

export const deleteRole = ({ id, message }) => ({
  type: actions.DELETE_ROLE,
  api: {
    path: `${RECORD_PATH.roles}/${id}`,
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
      redirect: `/admin/${RECORD_PATH.roles}`
    }
  }
});

export const clearSelectedRole = () => ({
  type: actions.CLEAR_SELECTED_ROLE
});
