import first from "lodash/first";

import { LOGICAL_OPERATORS } from "../constants";

export default expressions => ({
  expressions,
  operator: LOGICAL_OPERATORS.OR,
  evaluate: data => {
    const results = expressions.map(current => current.evaluate(data));

    return results.reduce((acc, elem) => elem || acc, first(results));
  }
});
