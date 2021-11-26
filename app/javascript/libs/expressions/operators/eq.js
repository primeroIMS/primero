import { parseISO } from "date-fns";
import isEqualDate from "date-fns/isEqual";
import first from "lodash/first";
import isEqual from "lodash/isEqual";

import { isApiDate } from "../../component-helpers";
import { COMPARISON_OPERATORS } from "../constants";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.EQ,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));

    if (isApiDate(value)) {
      return isEqualDate(parseISO(data[key]), parseISO(value));
    }

    if (Array.isArray(value)) {
      return isEqual(data[key], value);
    }

    return data[key] === value;
  }
});
