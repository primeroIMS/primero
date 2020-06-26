import { fromJS } from "immutable";

import {
  validationSchema,
  generalFields,
  generalForm,
  visibilityForm
} from "./base";

// eslint-disable-next-line import/prefer-default-export
export const separatorFieldForm = ({ field, i18n, formMode, isNested }) => {
  const fieldName = field.get("name");
  const generalFormFields = generalFields({ fieldName, i18n, formMode });

  return {
    forms: fromJS([
      generalForm({
        fieldName,
        i18n,
        formMode,
        fields: [
          generalFormFields.displayName,
          generalFormFields.helpText,
          generalFormFields.guidingQuestions
        ]
      }),
      visibilityForm({ fieldName, i18n, isNested })
    ]),
    validationSchema: validationSchema({ fieldName, i18n })
  };
};
