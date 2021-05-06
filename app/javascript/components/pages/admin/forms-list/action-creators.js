import { RECORD_PATH, METHODS } from "../../../../config/constants";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG } from "../../../action-dialog";

import { EXPORT_FORMS_PATH } from "./components/form-exporter/constants";
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

export const reorderedForms = ids => ({
  type: actions.SET_REORDERED_FORMS,
  payload: { ids }
});

export const saveFormsReorder = forms => ({
  type: actions.SAVE_FORMS_REORDER,
  api: forms.reduce(
    (prev, current) => [
      ...prev,
      {
        path: `${RECORD_PATH.forms}/${current.get("id")}`,
        method: "PATCH",
        body: {
          data: {
            order_form_group: current.get("order_form_group"),
            order: current.get("order")
          }
        }
      }
    ],
    []
  ),
  finishedCallback: enableReorder(false)
});

export const clearFormsReorder = () => ({
  type: actions.CLEAR_FORMS_REORDER
});

export const exportForms = ({ params, message }) => ({
  type: actions.EXPORT_FORMS,
  api: {
    path: EXPORT_FORMS_PATH,
    method: METHODS.GET,
    params,
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        },
        redirectWithIdFromResponse: false,
        redirect: false
      }
    ]
  }
});

export const clearExportForms = () => ({
  type: actions.CLEAR_EXPORT_FORMS
});
