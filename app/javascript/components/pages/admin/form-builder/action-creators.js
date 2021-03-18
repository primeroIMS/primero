import isEmpty from "lodash/isEmpty";

import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { METHODS, RECORD_PATH, SAVE_METHODS } from "../../../../config";

import { getFormRequestPath } from "./utils";
import actions from "./actions";

const saveFormSuccessCallback = (message, callback = true) => ({
  [callback ? "action" : "type"]: ENQUEUE_SNACKBAR,
  payload: {
    message,
    options: {
      variant: "success",
      key: generate.messageKey()
    }
  },
  redirectToEdit: true,
  redirect: `/admin/${RECORD_PATH.forms}`
});

export const fetchForm = (id, callback = false) => ({
  [callback ? "action" : "type"]: actions.FETCH_FORM,
  api: {
    path: `${RECORD_PATH.forms}/${id}`
  }
});

export const setSelectedField = name => ({
  type: actions.SET_SELECTED_FIELD,
  payload: { name }
});

export const setSelectedSubform = payload => ({
  type: actions.SET_SELECTED_SUBFORM,
  payload
});

export const setSelectedSubformField = name => ({
  type: actions.SET_SELECTED_SUBFORM_FIELD,
  payload: { name }
});

export const updateSelectedField = (data, subformId = null) => ({
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

export const clearSubforms = (callback = false) => ({
  [callback ? "action" : "type"]: actions.CLEAR_SUBFORMS
});

export const saveForm = ({ id, body, saveMethod, message }) => {
  const method = saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST;

  return {
    type: actions.SAVE_FORM,
    api: {
      path: getFormRequestPath(id, saveMethod),
      method,
      body,
      successCallback: [saveFormSuccessCallback(message), ...(id ? [fetchForm(id, true)] : []), clearSubforms(true)]
    }
  };
};

export const saveSubforms = (subforms, { id, body, saveMethod, message }) => {
  const subformsRequest = subforms.reduce((prev, current) => {
    const subfomBody = {
      data: current
    };
    const subformID = current?.get("id");

    if (subformID) {
      return [
        ...prev,
        {
          path: getFormRequestPath(subformID, SAVE_METHODS.update),
          method: METHODS.PATCH,
          body: subfomBody
        }
      ];
    }

    return [
      ...prev,
      {
        path: getFormRequestPath("", SAVE_METHODS.new),
        method: METHODS.POST,
        body: subfomBody
      }
    ];
  }, []);

  return {
    type: actions.SAVE_SUBFORMS,
    api: [...subformsRequest],
    ...(!isEmpty(body?.data?.fields)
      ? { finishedCallbackSubforms: saveForm({ id, body, saveMethod, message }) }
      : {
          finishedCallback: isEmpty(body?.data)
            ? [saveFormSuccessCallback(message, false), clearSubforms()]
            : saveForm({ id, body, saveMethod, message })
        })
  };
};

export const setNewField = (data, isSubform) => ({
  type: isSubform ? actions.SET_NEW_FIELD_SUBFORM : actions.SET_NEW_FIELD,
  payload: data
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

export const updateFieldTranslations = translations => ({
  type: actions.UPDATE_FIELD_TRANSLATIONS,
  payload: translations
});

export const setNewSubform = payload => ({
  type: actions.SET_NEW_SUBFORM,
  payload
});

export const setTemporarySubform = payload => ({
  type: actions.SET_TEMPORARY_SUBFORM,
  payload
});

export const mergeOnSelectedSubform = payload => ({
  type: actions.MERGE_SUBFORM_DATA,
  payload
});

export const selectExistingFields = payload => ({
  type: actions.SELECT_EXISTING_FIELDS,
  payload
});
