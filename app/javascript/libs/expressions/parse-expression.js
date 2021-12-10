import first from "lodash/first";

import { buildOperator, isLogicalOperator, isExpression } from "./utils";
import toExpression from "./to-expression";

const parseExpression = expression => {
  const [operator, value] = first(Object.entries(isExpression(expression) ? expression : toExpression(expression)));

  if (isLogicalOperator(operator)) {
    const expressions = Array.isArray(value) ? value.map(nested => parseExpression(nested)) : parseExpression(value);

    return buildOperator(operator, expressions);
  }

  return buildOperator(operator, value);
};

export default parseExpression;
