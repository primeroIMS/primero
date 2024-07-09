// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isObject from "lodash/isObject";

export default errors => {
  if (isObject(errors)) {
    return Object.values(errors);
  }

  return errors;
};
