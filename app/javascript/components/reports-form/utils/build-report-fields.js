// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";

export default (data, type) => {
  if (isEmpty(data)) {
    return [];
  }

  const result = [...(isString(data) ? data.split(",") : data)];

  return result.reduce((acc, name, order) => {
    return [
      ...acc,
      {
        name,
        position: {
          type,
          order
        }
      }
    ];
  }, []);
};
