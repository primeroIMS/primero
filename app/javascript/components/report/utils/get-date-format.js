import { MONTH_AND_YEAR_FORMAT } from "../../../config";
import { selectedDateFormat } from "../../../libs/date-picker-localization";
import { DATE_PATTERN } from "../constants";

import isDateRange from "./is-date-range";

export default (value, i18n) => {
  if (value.match(/^\w{3}-\d{4}$/)) {
    return MONTH_AND_YEAR_FORMAT;
  }
  if (value.match(new RegExp(`^${DATE_PATTERN}$`)) || isDateRange(value)) {
    return selectedDateFormat(false, i18n.locale);
  }

  return null;
};
