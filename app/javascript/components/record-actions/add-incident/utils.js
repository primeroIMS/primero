import { object } from "yup";

import { fieldValidations } from "../../record-form/form/validations";

/* eslint-disable import/prefer-default-export */
export const validationSchema = (subformSection, i18n) => {
  const subformSchema = subformSection?.fields?.map(field => fieldValidations(field, i18n));

  return object().shape(Object.assign({}, ...subformSchema));
};
