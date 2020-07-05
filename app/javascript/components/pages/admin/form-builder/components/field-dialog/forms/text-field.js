import { fromJS } from "immutable";

import { validationSchema, generalForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const textFieldForm = ({ field, i18n, formMode, isNested }) => {
  const fieldName = field.get("name");

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode }),
      visibilityForm({ fieldName, i18n, isNested })
    ]),
    validationSchema: validationSchema({ fieldName, i18n })
  };
};
