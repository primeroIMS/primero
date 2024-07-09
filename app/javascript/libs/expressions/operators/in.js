// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List } from "immutable";
import first from "lodash/first";

import { COMPARISON_OPERATORS } from "../constants";
import getDataValue from "../utils/get-data-value";

export default expression => ({
  expression,
  operator: COMPARISON_OPERATORS.IN,
  evaluate: data => {
    const [key, value] = first(Object.entries(expression));
    const dataValue = getDataValue(key, data);

    if (Array.isArray(dataValue) || List.isList(dataValue)) {
      return value.every(elem => dataValue.includes(elem));
    }

    return value.includes(dataValue);
  }
});
