// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import toInteger from "lodash/toInteger";

export default (data, sortByFn) =>
  data.sort((elem1, elem2) => {
    const value1 = sortByFn ? sortByFn(elem1) : elem1;
    const value2 = sortByFn ? sortByFn(elem2) : elem2;

    if (value1.match(/[0-9]+/)) {
      if (value2.match(/[0-9]+/)) {
        return toInteger(value1) - toInteger(value2);
      }

      return -1;
    }

    return 1;
  });
