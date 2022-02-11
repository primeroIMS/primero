import { COMPARISON_OPERATORS, LOGICAL_OPERATORS, MATHEMATICAL_OPERATORS } from "../constants";
import {
  eqOperator,
  geOperator,
  gtOperator,
  leOperator,
  ltOperator,
  inOperator,
  andOperator,
  orOperator,
  notOperator,
  sumOperator
} from "../operators";

export default (operator, value) => {
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
    case MATHEMATICAL_OPERATORS.SUM:
      return sumOperator(value);
    default:
      throw Error(`Operator ${operator} is not valid.`);
  }
};
