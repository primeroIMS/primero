import { parseExpression } from "../../../../libs/expressions";
import { SELECT_FIELD } from "../../constants";

export default (field, values) => {
  if (field.type === SELECT_FIELD && field.option_strings_condition) {
    return Object.entries(field.option_strings_condition).reduce(
      (acc, [tag, expression]) => (parseExpression(expression).evaluate(values) ? acc.concat(tag) : acc),
      []
    );
  }

  return [];
};
