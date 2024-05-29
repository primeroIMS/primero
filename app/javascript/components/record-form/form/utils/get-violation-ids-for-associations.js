// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import { VIOLATIONS_ASSOCIATIONS_RESPONSES } from "../../../../config";

export default (fieldName, violationID, parentUniqueId) => {
  if (!isEmpty(violationID)) {
    return violationID;
  }

  return fieldName === VIOLATIONS_ASSOCIATIONS_RESPONSES ? parentUniqueId : [parentUniqueId];
};
