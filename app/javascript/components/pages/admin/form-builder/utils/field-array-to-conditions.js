import { COMPARISON_OPERATORS } from "../../../../../libs/expressions/constants";
import { isOperator } from "../../../../../libs/expressions/utils";
import { isNotNullConstraint } from "../components/condition-dialog/utils";

const getConstraint = condition => {
  const { attribute, constraint, value } = condition;

  if (isNotNullConstraint(constraint)) {
    return { not: { eq: { [attribute]: "" } } };
  }

  if (Array.isArray(value) && value.length > 1) {
    return COMPARISON_OPERATORS.IN;
  }

  return COMPARISON_OPERATORS.EQ;
};

export default conditionArray =>
  conditionArray.reduce(
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
