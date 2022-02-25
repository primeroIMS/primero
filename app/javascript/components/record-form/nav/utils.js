import isEmpty from "lodash/isEmpty";

import { parseExpression } from "../../../libs/expressions";

export default (formGroupOrdered, values) =>
  formGroupOrdered.filter(
    form =>
      isEmpty(values) ||
      isEmpty(form.display_conditions) ||
      (!isEmpty(form.display_conditions) && parseExpression(form.display_conditions).evaluate(values))
  );
