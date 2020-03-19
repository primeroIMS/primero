import actions from "./actions";

export const fetchForms = () => ({
  type: actions.RECORD_FORMS,
  api: {
    path: "forms",
    normalizeFunc: "normalizeFormData"
  }
});
