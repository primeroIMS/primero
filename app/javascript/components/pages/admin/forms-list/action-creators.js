import { RECORD_PATH } from "../../../../config/constants";

import actions from "./actions";

export const fetchForms = () => ({
  type: actions.RECORD_FORMS,
  api: {
    path: RECORD_PATH.forms,
    normalizeFunc: "normalizeFormData"
  }
});

export const enableReorder = enable => ({
  type: actions.ENABLE_REORDER,
  payload: enable
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

export const saveFormsReorder = forms => ({
  type: actions.SAVE_FORMS_REORDER,
  api: forms.map(form => ({
    path: `${RECORD_PATH.forms}/${form.id}`,
    method: "PATCH",
    body: {
      data: {
        order_form_group: form.order_form_group,
        order: form.order
      }
    }
  })),
  finishedCallback: enableReorder(false)
});

export const clearFormsReorder = () => ({
  type: actions.CLEAR_FORMS_REORDER
});
