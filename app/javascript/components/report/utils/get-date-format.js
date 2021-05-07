import { DATE_PATTERN } from "../constants";

import isDateRange from "./is-date-range";

export default value => {
  if (value.match(/^\w{3}-\d{4}$/)) {
    return "MMM-yyyy";
  }
  if (value.match(new RegExp(`^${DATE_PATTERN}$`)) || isDateRange(value)) {
    return "dd-MMM-yyyy";
  }

  return null;
};
