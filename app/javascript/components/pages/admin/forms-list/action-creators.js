import { batch } from "react-redux";

import { RECORD_PATH } from "../../../../config/constants";

import actions from "./actions";

export const fetchForms = () => ({
  type: actions.RECORD_FORMS,
  api: {
    path: RECORD_PATH.forms,
    normalizeFunc: "normalizeFormData"
  }
});

export const reorderFormGroups = (formGroupId, order, filter) => ({
  type: actions.REORDER_FORM_GROUPS,
  payload: {
    formGroupId,
    order,
    filter
  }
});

export const reorderFormSections = (id, order, filter) => ({
  type: actions.REORDER_FORM_SECTIONS,
  payload: {
    id,
    order,
    filter
  }
});

export const saveFormOrder = ({ id, body }) => ({
  type: actions.SAVE_FORM_ORDER,
  api: {
    path: `${RECORD_PATH.forms}/${id}`,
    method: "PATCH",
    body
  }
});

export const reorderedForms = ids => ({
  type: actions.SET_REORDERED_FORMS,
  payload: { ids }
});

export const saveFormsReorder = forms => async dispatch => {
  batch(() => {
    forms.forEach(form => {
      dispatch(
        saveFormOrder({
          id: form.get("id"),
          body: {
            data: {
              order_form_group: form.get("order_form_group"),
              order: form.get("order")
            }
          }
        })
      );
    });
  });
};
