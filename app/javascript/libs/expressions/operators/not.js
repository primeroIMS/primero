// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { LOGICAL_OPERATORS } from "../constants";

export default expression => ({
  expression,
  operator: LOGICAL_OPERATORS.NOT,
  evaluate: data => {
    if (Array.isArray(expression)) {
      throw Error(`Invalid expression ${expression} for ${LOGICAL_OPERATORS.NOT} operator`);
    }

    return !expression.evaluate(data);
  }
});
