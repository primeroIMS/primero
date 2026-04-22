import { fromJS } from "immutable";

import { validationSchema, generalFields, generalForm, visibilityForm } from "./base";

// eslint-disable-next-line import/prefer-default-export
export const separatorFieldForm = ({ field, i18n, formMode, isNested, onManageTranslations, canManage }) => {
  const fieldName = field.get("name");
  const generalFormFields = generalFields({ fieldName, i18n, formMode, canManage });

  return {
    forms: fromJS([
      generalForm({
        fieldName,
        i18n,
        formMode,
        fields: [generalFormFields.displayName, generalFormFields.helpText, generalFormFields.guidingQuestions],
        onManageTranslations,
        canManage
      }),
      visibilityForm({ fieldName, i18n, isNested, canManage })
    ]),
    validationSchema: validationSchema({ fieldName, i18n })
  };
};
