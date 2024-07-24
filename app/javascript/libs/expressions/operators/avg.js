// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isNil from "lodash/isNil";
import has from "lodash/has";

import { MATHEMATICAL_OPERATORS } from "../constants";

import sumOperator from "./sum";

export default (expressions, extra) => ({
  expressions,
  operator: MATHEMATICAL_OPERATORS.AVG,
  evaluate: data => {
    const decimalPlaces = extra?.decimalPlaces;
    const sum = sumOperator(expressions).evaluate(data);
    const count = Object.values(expressions).reduce((prev, current) => {
      if (has(data, current) && !isNil(data[current]) && data[current] !== "") {
        return prev + 1;
      }

      return prev;
    }, 0);

    const res = sum / (count === 0 ? 1 : count);

    if (decimalPlaces) {
      return parseFloat(res.toFixed(decimalPlaces));
    }

    // Backwards compatible version rounds down
    return Math.floor(res);
  }
});
