import { METHODS, RECORD_PATH, SAVE_METHODS } from "../../../../config";

import { getFormRequestPath } from "./utils";
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

export const setSelectedSubformField = name => ({
  type: actions.SET_SELECTED_SUBFORM_FIELD,
  payload: { name }
});

export const updateSelectedField = (data, subformId) => ({
  type: actions.UPDATE_SELECTED_FIELD,
  payload: { data, subformId }
});

export const updateSelectedSubform = data => ({
  type: actions.UPDATE_SELECTED_SUBFORM,
  payload: { data }
});

export const reorderFields = (name, order, isSubform) => ({
  type: actions.REORDER_FIELDS,
  payload: { name, order, isSubform }
});

export const saveForm = ({ id, body, saveMethod, subforms = [] }) => {
  const method =
    saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST;

  return {
    type: actions.SAVE_FORM,
    api: [
      {
        path: getFormRequestPath(id, saveMethod),
        method,
        body
      }
    ].concat(
      subforms.map(subform => ({
        path: getFormRequestPath(subform.id, saveMethod),
        method,
        body: {
          data: subform
        }
      }))
    )
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

export const clearSelectedForm = () => ({
  type: actions.CLEAR_SELECTED_FORM
});

export const clearSelectedSubform = () => ({
  type: actions.CLEAR_SELECTED_SUBFORM
});

export const clearSelectedField = () => ({
  type: actions.CLEAR_SELECTED_FIELD
});

export const clearSelectedSubformField = () => ({
  type: actions.CLEAR_SELECTED_SUBFORM_FIELD
});
