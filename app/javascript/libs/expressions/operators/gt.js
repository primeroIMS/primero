import { isAfter, parseISO } from "date-fns";
import first from "lodash/first";

import { isApiDate } from "../../component-helpers";
import { COMPARISON_OPERATORS } from "../constants";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.GT,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));

    if (Array.isArray(value)) {
      throw Error(`Invalid argument ${value} for ${COMPARISON_OPERATORS.GT} operator`);
    }

    if (isApiDate(value)) {
      return isAfter(parseISO(data[key]), parseISO(value));
    }

    return data[key] > value;
  }
});
