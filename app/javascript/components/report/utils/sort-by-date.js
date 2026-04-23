import orderBy from "lodash/orderBy";

import isDateRange from "./is-date-range";

export default (data, multiple = false) => {
  return orderBy(
    data,
    curr => {
      const value = multiple ? curr[0] : curr;

      if (isDateRange(value)) {
        return new Date(value.slice(0, 11));
      }

      return new Date(value);
    },
    ["asc"]
  );
};
