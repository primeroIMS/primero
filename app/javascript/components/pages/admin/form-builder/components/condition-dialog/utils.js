import { NUMERIC_FIELD, TICK_FIELD } from "../../../../../form";

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

export const convertValue = (source, fieldType) => {
  if (fieldType === NUMERIC_FIELD) {
    return parseInt(source, 10);
  }

  if (fieldType === TICK_FIELD) {
    return source.map(elem => elem === "true");
  }

  return source;
};
