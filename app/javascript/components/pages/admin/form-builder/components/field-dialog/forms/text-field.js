import { fromJS } from "immutable";

import { validationSchema, generalForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const textFieldForm = ({ field, i18n, mode }) => {
  const fieldName = field.get("name");

  return {
    forms: fromJS([
      generalForm(fieldName, i18n, mode),
      visibilityForm(fieldName, i18n)
    ]),
    validationSchema: validationSchema(fieldName, i18n)
  };
};
