// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { validationSchema, generalForm, visibilityForm } from "./base";

/* eslint-disable import/prefer-default-export */
export const textFieldForm = ({ field, i18n, formMode, isNested, onManageTranslations, limitedProductionSite }) => {
  const fieldName = field.get("name");
  const fieldType = field.get("type");

  return {
    forms: fromJS([
      generalForm({ fieldName, i18n, formMode, onManageTranslations, limitedProductionSite }),
      visibilityForm({ fieldName, fieldType, i18n, isNested, limitedProductionSite })
    ]),
    validationSchema: validationSchema({ fieldName, i18n })
  };
};
