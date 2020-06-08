import { fromJS } from "immutable";

import {
  validationSchema,
  generalFields,
  generalForm,
  visibilityForm
} from "./base";

// eslint-disable-next-line import/prefer-default-export
export const separatorFieldForm = (fieldName, i18n) => {
  const general = Object.values(generalFields(fieldName, i18n)).filter(
    field => field.display_name !== "Required"
  );

  return {
    forms: fromJS([
      generalForm(fieldName, i18n, general),
      visibilityForm(fieldName, i18n)
    ]),
    validationSchema: validationSchema(fieldName, i18n)
  };
};
