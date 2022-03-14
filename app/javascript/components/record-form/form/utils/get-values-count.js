import { isNil, has } from "lodash";

export default (calculationExpression, values) => {
  return Object.values(calculationExpression.sum).reduce((prev, current) => {
    if (has(values, current) && !isNil(values[current]) && values[current] !== "") {
      return prev + 1;
    }

    return prev;
  }, 0);
};
