// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isAfter, parseISO } from "date-fns";
import isEqualDate from "date-fns/isEqual";
import first from "lodash/first";

import { hasApiDateFormat } from "../../component-helpers";
import { COMPARISON_OPERATORS } from "../constants";
import getDataValue from "../utils/get-data-value";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.GE,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));
    const dataValue = getDataValue(key, data);

    if (Array.isArray(value)) {
      throw Error(`Invalid argument ${value} for ${COMPARISON_OPERATORS.GE} operator`);
    }

    if (hasApiDateFormat(value)) {
      const date1 = parseISO(dataValue);
      const date2 = parseISO(value);

      return isAfter(date1, date2) || isEqualDate(date1, date2);
    }

    return dataValue >= value;
  }
});
