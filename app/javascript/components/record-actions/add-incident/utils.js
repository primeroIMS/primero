// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { object } from "yup";

import { fieldValidations } from "../../record-form/form/validations";

/* eslint-disable import/prefer-default-export */
export const validationSchema = (subformSection, { i18n, online }) => {
  const subformSchema = subformSection?.fields?.map(field => fieldValidations(field, { i18n, online }));

  return object().shape(Object.assign({}, ...subformSchema));
};
