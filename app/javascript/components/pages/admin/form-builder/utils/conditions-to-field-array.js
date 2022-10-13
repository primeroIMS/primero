import first from "lodash/first";

import { COMPARISON_OPERATORS, LOGICAL_OPERATORS } from "../../../../../libs/expressions/constants";
import { NOT_NULL } from "../../../../reports-form/constants";

const isNotNullCondition = condition => {
  const [constraint, current] = first(Object.entries(condition));
  const [operator, data] = first(Object.entries(current));
  const [, value] = first(Object.entries(data));

  if (constraint === LOGICAL_OPERATORS.NOT && operator === COMPARISON_OPERATORS.EQ && value === "") {
    return true;
  }

  return false;
};

export default conditions => {
  if (!conditions || !Object.keys(conditions).length) {
    return [];
  }

  if (conditions.and) {
    return conditions.and.map(condition => {
      const [constraint, current] = first(Object.entries(condition));
      const [attribute, value] = first(Object.entries(current));

      if (isNotNullCondition(condition)) {
        const [key] = first(Object.entries(value));

        return { constraint: NOT_NULL, attribute: key };
      }

      return { constraint, attribute, value };
    });
  }

  const [constraint, condition] = first(Object.entries(conditions));
  const [attribute, value] = first(Object.entries(condition));

  if (isNotNullCondition(conditions)) {
    const [key] = first(Object.entries(value));

    return { constraint: NOT_NULL, attribute: key };
  }

  return [{ constraint, attribute, value }];
};
