import { fromJS } from "immutable";

import {
  subform,
  validationSchema,
  visibilityFields,
  visibilityForm
} from "./base";

/* eslint-disable import/prefer-default-export */
export const subformField = (fieldName, i18n) => {
  const { showOn, visible, mobileVisible, hideOnViewPage } = visibilityFields(
    fieldName,
    i18n
  );

  return {
    forms: fromJS([
      subform(i18n),
      visibilityForm(fieldName, i18n, [
        showOn,
        { row: [visible, mobileVisible, hideOnViewPage] }
      ])
    ])
    // validationSchema: validationSchema(fieldName, i18n)
  };
};
