import isNil from "lodash/isNil";
import has from "lodash/has";

import { MATHEMATICAL_OPERATORS } from "../constants";

import sumOperator from "./sum";

export default expressions => ({
  expressions,
  operator: MATHEMATICAL_OPERATORS.AVG,
  evaluate: data => {
    const sum = sumOperator(expressions).evaluate(data);

    const count = Object.values(expressions).reduce((prev, current) => {
      if (has(data, current) && !isNil(data[current]) && data[current] !== "") {
        return prev + 1;
      }

      return prev;
    }, 0);

    return Math.floor(sum / (count === 0 ? 1 : count));
  }
});
