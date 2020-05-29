import { fromJS } from "immutable";

import { validationSchema, subform, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const subformField = (fieldName, i18n) => ({
  forms: fromJS([subform(fieldName, i18n), visibilityForm(fieldName, i18n)]),
  // validationSchema: validationSchema(fieldName, i18n)
});
