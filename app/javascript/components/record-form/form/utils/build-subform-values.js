// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import omit from "lodash/omit";

import { compactBlank } from "../../utils";
import { VIOLATIONS_SUBFORM_UNIQUE_IDS, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS } from "../../../../config";

export default (fieldName, values) => {
  if (VIOLATIONS_SUBFORM_UNIQUE_IDS.includes(fieldName)) {
    const currentViolationData = omit(values, VIOLATIONS_ASSOCIATIONS_UNIQUE_IDS);

    return compactBlank(currentViolationData);
  }

  return values;
};
