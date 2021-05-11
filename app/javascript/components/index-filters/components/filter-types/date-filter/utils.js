import { parseISO } from "date-fns";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import first from "lodash/first";

export const parseDateValue = (value, dateIncludeTime = false) =>
  dateIncludeTime ? parseISO(value) : parseISO(value.slice(0, 10));

export const getDateValue = (picker, value, dateIncludeTime = false) => {
  if (isNil(value) || isEmpty(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    if (typeof first(value) !== "string") {
      return value;
    }

    const range = first(value).split("..");

    if (isEmpty(range)) {
      return value;
    }

    const dateValue = picker === "from" ? range[0] : range[1];

    return parseDateValue(dateValue, dateIncludeTime);
  }

  return parseDateValue(value[picker], dateIncludeTime);
};
