import { RECORD_PATH, SAVE_METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchForm = id => ({
  type: actions.FETCH_FORM,
  api: {
    path: `${RECORD_PATH.forms}/${id}`
  }
});

export const setSelectedField = name => ({
  type: actions.SET_SELECTED_FIELD,
  payload: { name }
});

export const updateSelectedField = data => ({
  type: actions.UPDATE_SELECTED_FIELD,
  payload: { data }
});

export const reorderFields = (name, order) => ({
  type: actions.REORDER_FIELDS,
  payload: { name, order }
});

export const saveForm = ({ id, body, saveMethod, message }) => {
  const path =
    saveMethod === SAVE_METHODS.update
      ? `${RECORD_PATH.forms}/${id}`
      : RECORD_PATH.forms;

  return {
    type: actions.SAVE_FORM,
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
        redirectToEdit: true,
        redirect: `/admin/${RECORD_PATH.forms}`
      }
    }
  };
};

export const clearSelectedForm = () => {
  return {
    type: actions.CLEAR_SELECTED_FORM
  };
};

export const setNewField = (name, type) => ({
  type: actions.SET_NEW_FIELD,
  payload: { name, type }
});

export const createSelectedField = data => ({
  type: actions.CREATE_SELECTED_FIELD,
  payload: { data }
});
