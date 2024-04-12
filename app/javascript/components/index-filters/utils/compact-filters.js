// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isObject from "lodash/isObject";
import isEmpty from "lodash/isEmpty";

export default values =>
  Object.keys(values).reduce((prev, current) => {
    const obj = prev;
    const value = values[current];

    if ((Array.isArray(value) || isObject(value)) && isEmpty(value)) {
      return obj;
    }

    if (value) {
      obj[current] = values[current];
    }

    return obj;
  }, {});
