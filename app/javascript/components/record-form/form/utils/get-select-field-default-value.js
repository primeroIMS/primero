// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

export default (field, selectedDefaultValue) => {
  if (field.multi_select && !Array.isArray(selectedDefaultValue)) {
    return isEmpty(selectedDefaultValue) ? [] : [selectedDefaultValue];
  }

  return selectedDefaultValue;
};
