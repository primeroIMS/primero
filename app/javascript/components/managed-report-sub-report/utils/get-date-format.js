import { DATE_FORMAT, MONTH_AND_YEAR_FORMAT } from "../../../config";
import { DATE_PATTERN } from "../constants";

import isDateRange from "./is-date-range";

export default value => {
  if (value.match(/^\w{3}-\d{4}$/)) {
    return MONTH_AND_YEAR_FORMAT;
  }
  if (value.match(new RegExp(`^${DATE_PATTERN}$`)) || isDateRange(value)) {
    return DATE_FORMAT;
  }

  return null;
};
