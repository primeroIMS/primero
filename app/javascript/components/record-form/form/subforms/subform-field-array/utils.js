import { isImmutable } from "immutable";
import { isEmpty } from "lodash";

const dataMeetConditions = (objectToEval, displayConditions) => {
  const objToEval = isImmutable(objectToEval) ? objectToEval.toJS() : objectToEval;
  // displayConditions =
  // [ {"relation": ["father","mother"],"relation_is_alive": "alive"},{"relation_is_caregiver": true}]
  const isRenderable = displayConditions.reduce((currentBoolean, currentCondition) => {
    // currentCondition = { "relation": ["father", "mother"], "relation_is_alive": "alive" }
    // keysCurrentConditions = ['relation', 'relation_is_alive']
    const keysCurrentConditions = Object.keys(currentCondition);

    const resultEvaluationCurrentConditions = keysCurrentConditions.every(currentKeyCondition => {
      // currentKeyCondition = 'relation'
      // valuesToEval = ["father", "mother"]
      const valuesToEval = currentCondition[currentKeyCondition];

      if (Array.isArray(valuesToEval)) {
        return valuesToEval.some(val => objToEval[currentKeyCondition] === val);
      }

      return objToEval[currentKeyCondition] === valuesToEval;
    });

    return currentBoolean || resultEvaluationCurrentConditions;
  }, false);

  return isRenderable;
};

export const valuesWithDisplayConditions = (values, displayConditions) => {
  if (isEmpty(displayConditions)) {
    return values;
  }

  return values.filter(val => dataMeetConditions(val, displayConditions));
};

export const fieldsToRender = (listFields, fields) => {
  if (isEmpty(listFields)) {
    return fields;
  }

  return fields.filter(field => listFields.includes(field.name));
};
