import { fromJS } from "immutable";

import {
  validationSchema,
  generalForm,
  optionsForm,
  visibilityForm
} from "./base";

/* eslint-disable import/prefer-default-export */
export const textFieldForm = (fieldName, i18n) => ({
  forms: fromJS([
    generalForm(fieldName, i18n),
    optionsForm(fieldName, i18n),
    visibilityForm(fieldName, i18n)
  ]),
  validationSchema: validationSchema(fieldName, i18n)
});
