// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isNil from "lodash/isNil";

export default (field, selectedDefaultValue) => {
  if (field.multi_select && !Array.isArray(selectedDefaultValue)) {
    return isNil(selectedDefaultValue) ? [] : [selectedDefaultValue];
  }

  return selectedDefaultValue;
};
