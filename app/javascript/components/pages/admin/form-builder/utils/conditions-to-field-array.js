import first from "lodash/first";

import { LOGICAL_OPERATORS } from "../../../../../libs/expressions/constants";

const conditionToField = (condition, type) => {
  const [constraint, current] = first(Object.entries(condition));
  const [attribute, value] = first(Object.entries(current));

  return type ? { constraint, attribute, value, type } : { constraint, attribute, value };
};

const conditionListToFieldArray = (condition, prevOperator) =>
  [LOGICAL_OPERATORS.AND, LOGICAL_OPERATORS.OR].reduce((acc, operator) => {
    const conditionList = condition[operator] || [];

    return conditionList.reduce((innerAcc, elem, index) => {
      if (elem[LOGICAL_OPERATORS.AND] || elem[LOGICAL_OPERATORS.OR]) {
        return [...innerAcc, ...conditionListToFieldArray(elem, index > 0 ? operator : null)];
      }

      const type = index === 0 ? prevOperator : operator;

      return [...innerAcc, conditionToField(elem, type)];
    }, acc);
  }, []);

export default conditions => {
  if (!conditions || !Object.keys(conditions).length) {
    return [];
  }

  if (conditions[LOGICAL_OPERATORS.AND] || conditions[LOGICAL_OPERATORS.OR]) {
    return conditionListToFieldArray(conditions);
  }

  return [conditionToField(conditions)];
};
