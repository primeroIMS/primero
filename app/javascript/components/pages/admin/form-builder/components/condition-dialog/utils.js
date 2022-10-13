import { NOT_NULL } from "../../../../../reports-form/constants";

export const registerFields = ({ register, fieldsRef, index, conditionsFieldName }) => {
  if (!fieldsRef[`${conditionsFieldName}.${index}.constraint`]) {
    register(`${conditionsFieldName}.${index}.constraint`);
    register(`${conditionsFieldName}.${index}.attribute`);
    register(`${conditionsFieldName}.${index}.value`);
  }
};

export const updateCondition = ({ setValue, conditionsFieldName, index, condition }) => {
  setValue(`${conditionsFieldName}.${index}.constraint`, condition.constraint, {
    shouldTouch: true,
    shouldDirty: true
  });
  setValue(`${conditionsFieldName}.${index}.attribute`, condition.attribute, {
    shouldTouch: true,
    shouldDirty: true
  });
  setValue(`${conditionsFieldName}.${index}.value`, condition.value, {
    shouldTouch: true,
    shouldDirty: true
  });
};

export const isNotNullConstraint = constraint =>
  constraint === NOT_NULL || constraint === "true" || constraint === true;
