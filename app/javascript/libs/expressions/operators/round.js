// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { MATHEMATICAL_OPERATORS } from "../constants";

export default expressions => ({
  expressions,
  operator: MATHEMATICAL_OPERATORS.ROUND,
  evaluate: data => {
    const results = expressions.map(current => (current.evaluate ? current.evaluate(data) : current));

    if (results.length !== 2) {
      return 0;
    }
    try {
      const rounded = results[0].toFixed(results[1]);
      return rounded;
    } catch (error) {
      return 0;
    }
  }
});
