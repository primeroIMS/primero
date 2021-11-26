import first from "lodash/first";

import { COMPARISON_OPERATORS } from "../constants";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.IN,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));

    if (Array.isArray(data[key])) {
      return value.every(elem => data[key].includes(elem));
    }

    return value.includes(data[key]);
  }
});
