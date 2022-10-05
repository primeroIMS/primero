import { NOT_NULL } from "../../../../../reports-form/constants";

export const registerFields = ({ register, fieldsRef, index, fieldName }) => {
  if (!fieldsRef[`${fieldName}.${index}.constraint`]) {
    register(`${fieldName}.${index}.constraint`);
    register(`${fieldName}.${index}.attribute`);
    register(`${fieldName}.${index}.value`);
  }
};

export const updateCondition = ({ setValue, fieldName, index, condition }) => {
  setValue(`${fieldName}.${index}.constraint`, condition.constraint, {
    shouldTouch: true,
    shouldDirty: true
  });
  setValue(`${fieldName}.${index}.attribute`, condition.attribute, {
    shouldTouch: true,
    shouldDirty: true
  });
  setValue(`${fieldName}.${index}.value`, condition.value, {
    shouldTouch: true,
    shouldDirty: true
  });
};

export const isNotNullConstraint = constraint =>
  constraint === NOT_NULL || constraint === "true" || constraint === true;
