import { isEmpty } from "lodash";

import { RECORD_TYPES, TRACES_SUBFORM_UNIQUE_ID } from "../../../../../config";
import { parseExpression } from "../../../../../libs/expressions";

export const valuesWithDisplayConditions = (values, displayConditions) => {
  if (isEmpty(values)) {
    return [];
  }
  if (isEmpty(displayConditions)) {
    return values;
  }

  const expression = parseExpression(displayConditions);

  return values.filter(val => expression.evaluate(val));
};

export const valuesWithHiddenAttribute = (values, displayConditions) => {
  if (isEmpty(values)) {
    return [];
  }
  if (isEmpty(displayConditions)) {
    return values;
  }

  const expression = parseExpression(displayConditions);

  return values.map(val => (expression.evaluate(val) ? val : { ...val, _hidden: true }));
};

export const fieldsToRender = (listFields, fields) => {
  if (isEmpty(listFields)) {
    return fields;
  }

  return fields.filter(field => listFields.includes(field.name));
};

export const isTracesSubform = (recordType, formSection) =>
  RECORD_TYPES[recordType] === RECORD_TYPES.tracing_requests && formSection.unique_id === TRACES_SUBFORM_UNIQUE_ID;
