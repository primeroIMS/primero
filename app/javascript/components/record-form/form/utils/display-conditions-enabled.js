import isEmpty from "lodash/isEmpty";

import getDisplayConditions from "./get-display-conditions";

export default displayConditions => {
  return !displayConditions?.disabled && !isEmpty(getDisplayConditions(displayConditions));
};
