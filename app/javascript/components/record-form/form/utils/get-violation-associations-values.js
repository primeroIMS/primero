import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";

import { VIOLATION_ASSOCIACTIONS_SUBFOM } from "../constants";

export default (values, uniqueId) => {
  if (isEmpty(values)) {
    return {};
  }

  const valuesToEvaluate = pick(values, ...VIOLATION_ASSOCIACTIONS_SUBFOM);

  return Object.entries(valuesToEvaluate).reduce((acc, curr) => {
    const [key, currentValues] = curr;

    const valuesFiltered = uniqueId
      ? { [key]: currentValues.filter(val => val.violations_ids.includes(uniqueId)) }
      : {};

    return { ...acc, ...valuesFiltered };
  }, {});
};
