/* eslint-disable import/prefer-default-export */
import { isEmpty } from "lodash";

const dataMeetConditions = (objectToEval, displayConditions) => {
  // displayConditions =
  // [ {"relation": ["father","mother"],"relation_is_alive": "alive"},{"relation_is_caregiver": true}]
  const isRenderable = displayConditions.reduce(
    (currentBoolean, currentCondition) => {
      // currentCondition = { "relation": ["father", "mother"], "relation_is_alive": "alive" }
      // keysCurrentConditions = ['relation', 'relation_is_alive']
      const keysCurrentConditions = Object.keys(currentCondition);

      const resultEvaluationCurrentConditions = keysCurrentConditions.every(
        currentKeyCondition => {
          // currentKeyCondition = 'relation'
          // valuesToEval = ["father", "mother"]
          const valuesToEval = currentCondition[currentKeyCondition];

          if (Array.isArray(valuesToEval)) {
            return valuesToEval.some(
              val => objectToEval[currentKeyCondition] === val
            );
          }

          return objectToEval[currentKeyCondition] === valuesToEval;
        }
      );

      return currentBoolean || resultEvaluationCurrentConditions;
    },
    false
  );

  return isRenderable;
};

export const valuesWithDisplayConditions = (values, displayConditions) => {
  if (isEmpty(displayConditions)) {
    return values;
  }

  // const conditions = buildConditions(displayConditions);

  return values.filter(val => dataMeetConditions(val, displayConditions));
};
