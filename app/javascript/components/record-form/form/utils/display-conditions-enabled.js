// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import getDisplayConditions from "./get-display-conditions";

export default displayConditions => {
  return !displayConditions?.disabled && !isEmpty(getDisplayConditions(displayConditions));
};
