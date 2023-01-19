import last from "lodash/last";

import { COMPARISON_OPERATORS, LOGICAL_OPERATORS } from "../../../../../libs/expressions/constants";
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
    return null;
  }

  if (conditionArray.length === 1) {
    const elem = conditionArray[0];

    return { [getConstraint(elem)]: { [elem.attribute]: elem.value } };
  }

  return conditionArray.reduce((acc, elem, index) => {
    const condition = { [getConstraint(elem)]: { [elem.attribute]: elem.value } };

    if (index === 0) {
      return condition;
    }

    if (elem.type === LOGICAL_OPERATORS.AND && acc[LOGICAL_OPERATORS.OR]) {
      const lastCondition = last(acc.or);

      return {
        [LOGICAL_OPERATORS.OR]: [
          ...acc.or.slice(0, acc.or.length - 1),
          { [elem.type]: [...(lastCondition.and ? lastCondition.and : [lastCondition]), condition] }
        ]
      };
    }

    if (elem.type && acc[elem.type]) {
      return { [elem.type]: [...acc[elem.type], condition] };
    }

    return {
      [elem.type || LOGICAL_OPERATORS.AND]: [acc, condition]
    };
  }, {});
};
