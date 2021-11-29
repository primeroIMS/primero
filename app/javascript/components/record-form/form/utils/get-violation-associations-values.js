import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";

import { VIOLATION_ASSOCIACTIONS_SUBFOM } from "../constants";

export default values => {
  if (isEmpty(values)) {
    return {};
  }

  const valuesToEvaluate = pick(values, ...VIOLATION_ASSOCIACTIONS_SUBFOM);

  // TODO: We need to filter out by field that save the current violationID, how to match subform with current violation
  return Object.entries(valuesToEvaluate).reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});
};
