import { fromJS, isImmutable } from "immutable";
import { parseISO } from "date-fns";
import isEqualDate from "date-fns/isEqual";
import first from "lodash/first";
import isEqual from "lodash/isEqual";

import { hasApiDateFormat } from "../../component-helpers";
import { COMPARISON_OPERATORS } from "../constants";
import getDataValue from "../utils/get-data-value";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.EQ,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));
    const dataValue = getDataValue(key, data);

    if (hasApiDateFormat(value)) {
      return isEqualDate(parseISO(dataValue), parseISO(value));
    }

    if (Array.isArray(value)) {
      return isImmutable(dataValue) ? fromJS(value).equals(dataValue) : isEqual(dataValue, value);
    }

    return dataValue === value;
  }
});
