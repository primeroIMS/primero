// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import { parseExpression } from "../../../libs/expressions";
import displayConditionsEnabled from "../form/utils/display-conditions-enabled";
import getDisplayConditions from "../form/utils/get-display-conditions";

export default (formGroupOrdered, values) =>
  formGroupOrdered.filter(
    form =>
      isEmpty(values) ||
      !displayConditionsEnabled(form.display_conditions) ||
      (displayConditionsEnabled(form.display_conditions) &&
        parseExpression(getDisplayConditions(form.display_conditions)).evaluate(values))
  );
