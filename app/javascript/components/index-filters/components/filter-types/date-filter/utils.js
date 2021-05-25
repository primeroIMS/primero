import { endOfDay, startOfDay, parseISO } from "date-fns";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import first from "lodash/first";

import { toServerDateFormat } from "../../../../../libs";

export const defaultDateValues = dateIncludeTime => ({
  from: toServerDateFormat(startOfDay(new Date()), { includeTime: true, normalize: dateIncludeTime === true }),
  to: toServerDateFormat(endOfDay(new Date()), { includeTime: true, normalize: dateIncludeTime === true })
});

export const parseDateValue = (value, dateIncludeTime = false) => {
  if (isNil(value) || isEmpty(value)) {
    return null;
  }

  return dateIncludeTime ? parseISO(value) : parseISO(value.slice(0, 10));
};

export const getDateValue = (picker, value, dateIncludeTime = false) => {
  if (isNil(value) || isEmpty(value)) {
    return defaultDateValues(dateIncludeTime)[picker];
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

export const getDatesValue = (values, dateIncludeTime) => {
  const defaultValues = defaultDateValues(dateIncludeTime);

  if (isNil(values)) {
    return defaultValues;
  }

  if (Array.isArray(values)) {
    if (typeof first(values) !== "string") {
      return values;
    }

    const range = first(values).split("..");

    if (isEmpty(range)) {
      return values;
    }

    return {
      from: range[0] || defaultValues.from,
      to: range[1] || defaultValues.to
    };
  }

  if (typeof values === "object") {
    return {
      from: values.from || defaultValues.from,
      to: values.to || defaultValues.to
    };
  }

  return values;
};
