import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";

import { DATE_FORMAT, DATE_TIME_FORMAT } from "../../../config";
import { EMPTY_VALUE } from "../constants";

const translateDate = (value, dateIncludeTime, i18n) => {
  const format = dateIncludeTime ? DATE_TIME_FORMAT : DATE_FORMAT;
  const date = i18n.localizeDate(value, format);

  return isNil(date) ? value : date;
};

export default (value, dateIncludeTime, i18n) => {
  if (isNil(value) || (Array.isArray(value) && isEmpty(value))) {
    return EMPTY_VALUE;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return i18n.t(value.toString());
  }

  return translateDate(value, dateIncludeTime, i18n);
};
