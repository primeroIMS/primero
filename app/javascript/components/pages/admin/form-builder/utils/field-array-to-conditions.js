import { COMPARISON_OPERATORS } from "../../../../../libs/expressions/constants";
import { isOperator } from "../../../../../libs/expressions/utils";

const getConstraint = condition => {
  const { constraint, value } = condition;

  if (Array.isArray(value)) {
    return COMPARISON_OPERATORS.IN;
  }

  return isOperator(constraint) ? constraint : COMPARISON_OPERATORS.EQ;
};

export default conditionArray => {
  if (!conditionArray || conditionArray.length <= 0) {
    return {};
  }

  return conditionArray.reduce(
    (acc, elem) => {
      const constraint = getConstraint(elem);

      return {
        and: [
          ...acc.and,
          isOperator(constraint) ? { [getConstraint(elem)]: { [elem.attribute]: elem.value } } : constraint
        ]
      };
    },
    {
      and: []
    }
  );
};
