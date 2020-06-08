/* eslint-disable import/prefer-default-export */

import { FILTERS_FIELD } from "../../constants";

export const registerValues = (index, data, currentValues, methods) => {
  Object.entries(data).forEach(entry => {
    const fieldName = `${FILTERS_FIELD}.${index}.${entry[0]}`;

    const rest = currentValues.filter(i => i.index.toString() !== index);

    if (!methods.control[fieldName]) {
      methods.register({ name: fieldName });
    }
    methods.setValue(fieldName, entry[1]);

    Object.entries(rest).forEach(restEl => {
      const { index: restElIndex, data: restElData } = restEl[1];
      const restFieldName = `${FILTERS_FIELD}.${restElIndex}.${entry[0]}`;

      console.log(restFieldName, restElData[entry[0]]);

      if (!methods.control[restFieldName]) {
        methods.register({ name: restFieldName });
      }
      methods.setValue(restFieldName, restElData[entry[0]]);
    });
  });
};
