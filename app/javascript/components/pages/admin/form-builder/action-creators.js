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

export const setSelectedSubform = id => ({
  type: actions.SET_SELECTED_SUBFORM,
  payload: { id }
});

export const updateSelectedField = data => ({
  type: actions.UPDATE_SELECTED_FIELD,
  payload: { data }
});

export const updateSelectedSubform = data => ({
  type: actions.UPDATE_SELECTED_SUBFORM,
  payload: { data }
});

export const reorderFields = (name, order, isSubform) => ({
  type: actions.REORDER_FIELDS,
  payload: { name, order, isSubform }
});

export const saveSubforms = subforms => ({
  type: actions.SAVE_SUBFORMS,
  api: subforms.map(subform => ({
    path: `${RECORD_PATH.forms}/${subform.id}`,
    method: "PATCH",
    body: {
      data: subform
    }
  }))
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
