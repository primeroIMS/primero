import { SET_FORM_FILTERS, CLEAR_FORM_FILTERS } from "./actions";

export const setFormFilters = (formName, filters) => ({
  type: SET_FORM_FILTERS,
  payload: { formName, filters }
});

export const clearFormFilters = formName => ({
  type: CLEAR_FORM_FILTERS,
  payload: formName
});
