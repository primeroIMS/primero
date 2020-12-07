import isNil from "lodash/isNil";

import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../config";
import { EMPTY_VALUE } from "../constants";

const translateDate = (value, dateIncludeTime, i18n) => {
  const format = dateIncludeTime ? DATE_TIME_FORMAT : DATE_FORMAT;
  const date = i18n.localizeDate(value, format);

  return isNil(date) ? value : date;
};

export default (value, dateIncludeTime, i18n) => {
  if (isNil(value)) {
    return EMPTY_VALUE;
  }

  return translateDate(value, dateIncludeTime, i18n);
};
