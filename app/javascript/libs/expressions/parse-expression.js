import first from "lodash/first";

import { buildOperator, isLogicalOperator } from "./utils";

const parseExpression = expression => {
  const [operator, value] = first(Object.entries(expression));

  if (isLogicalOperator(operator)) {
    const expressions = Array.isArray(value) ? value.map(nested => parseExpression(nested)) : parseExpression(value);

    return buildOperator(operator, expressions);
  }

  return buildOperator(operator, value);
};

export default parseExpression;
