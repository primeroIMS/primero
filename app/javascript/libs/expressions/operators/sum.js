// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isInteger from "lodash/isInteger";

import { MATHEMATICAL_OPERATORS } from "../constants";

export default expressions => ({
  expressions,
  operator: MATHEMATICAL_OPERATORS.SUM,
  evaluate: data => {
    const results = expressions.map(current => (current.evaluate ? current.evaluate(data) : current));
    const sum = results.reduce((prev, curr) => prev + (isInteger(curr) ? curr : +data[curr] || 0), 0);

    return sum;
  }
});
