import { NUMERIC_FIELD, TICK_FIELD } from "../../../../../form";

export const registerFields = ({ register, fieldsRef, index, fieldName }) => {
  if (!fieldsRef[`${fieldName}.${index}.constraint`]) {
    register(`${fieldName}.${index}.constraint`);
    register(`${fieldName}.${index}.attribute`);
    register(`${fieldName}.${index}.value`);
    register(`${fieldName}.${index}.type`);
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
  setValue(`${fieldName}.${index}.type`, condition.type, {
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

export const buildFieldName = (name, isNested) => {
  if (name) {
    return `${name}.${isNested ? "display_conditions_subform" : "display_conditions_record"}`;
  }

  return "display_conditions";
};
