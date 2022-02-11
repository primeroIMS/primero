import first from "lodash/first";
import { isObject } from "lodash";

import { buildOperator, isLogicalOperator, isExpression } from "./utils";
import toExpression from "./to-expression";
import isMathematicalOperator from "./utils/is-mathematical-operator";

const parseExpression = expression => {
  const [operator, value] = first(Object.entries(isExpression(expression) ? expression : toExpression(expression)));

  if (isLogicalOperator(operator)) {
    const expressions = Array.isArray(value) ? value.map(nested => parseExpression(nested)) : parseExpression(value);

    return buildOperator(operator, expressions);
  }
  if (isMathematicalOperator(operator)) {
    const mathExp = Array.isArray(value)
      ? value.map(nested => {
          return isObject(nested) ? parseExpression(nested) : nested;
        })
      : parseExpression(value);

    return buildOperator(operator, mathExp);
  }

  return buildOperator(operator, value);
};

export default parseExpression;
