import { isAfter, parseISO } from "date-fns";
import first from "lodash/first";

import { hasApiDateFormat } from "../../component-helpers";
import { COMPARISON_OPERATORS } from "../constants";
import getDataValue from "../utils/get-data-value";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.GT,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));
    const dataValue = getDataValue(key, data);

    if (Array.isArray(value)) {
      throw Error(`Invalid argument ${value} for ${COMPARISON_OPERATORS.GT} operator`);
    }

    if (hasApiDateFormat(value)) {
      return isAfter(parseISO(dataValue), parseISO(value));
    }

    return dataValue > value;
  }
});
