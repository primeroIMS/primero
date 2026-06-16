import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";

import { VIOLATION_ASSOCIATIONS_SUBFORM } from "../constants";

export default (values, uniqueId) => {
  if (isEmpty(values)) {
    return {};
  }

  const valuesToEvaluate = pick(values, ...VIOLATION_ASSOCIATIONS_SUBFORM);

  return Object.entries(valuesToEvaluate).reduce((acc, curr) => {
    const [key, currentValues] = curr;

    const valuesFiltered = uniqueId
      ? { [key]: currentValues.filter(val => val.violations_ids.includes(uniqueId)) }
      : {};

    return { ...acc, ...valuesFiltered };
  }, {});
};
