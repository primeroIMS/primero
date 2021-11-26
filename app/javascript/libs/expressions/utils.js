import { COMPARISON_OPERATORS, LOGICAL_OPERATORS } from "./constants";
import {
  eqOperator,
  geOperator,
  gtOperator,
  leOperator,
  ltOperator,
  inOperator,
  andOperator,
  orOperator,
  notOperator
} from "./operators";

export const isLogicalOperator = value => Object.values(LOGICAL_OPERATORS).includes(value);

export const isComparisonOperator = value => Object.values(COMPARISON_OPERATORS).includes(value);

export const isOperator = value => isLogicalOperator(value) || isComparisonOperator(value);

export const buildOperator = (operator, value) => {
  switch (operator) {
    case COMPARISON_OPERATORS.EQ:
      return eqOperator(value);
    case COMPARISON_OPERATORS.GE:
      return geOperator(value);
    case COMPARISON_OPERATORS.GT:
      return gtOperator(value);
    case COMPARISON_OPERATORS.LE:
      return leOperator(value);
    case COMPARISON_OPERATORS.LT:
      return ltOperator(value);
    case COMPARISON_OPERATORS.IN:
      return inOperator(value);
    case LOGICAL_OPERATORS.AND:
      return andOperator(value);
    case LOGICAL_OPERATORS.OR:
      return orOperator(value);
    case LOGICAL_OPERATORS.NOT:
      return notOperator(value);
    default:
      throw Error(`Operator ${operator} is not valid.`);
  }
};
