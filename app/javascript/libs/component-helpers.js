import { isImmutable, List, Map, Record } from "immutable";
import { addHours, format, parseISO } from "date-fns";
import isString from "lodash/isString";

import { API_DATE_FORMAT, API_DATE_TIME_FORMAT, ISO_DATE_REGEX, ISO_DATE_TIME_REGEX } from "../config/constants";

import displayNameHelper from "./display-name-helper";

export const dataToJS = data => {
  if (data instanceof Map || data instanceof List) {
    return data.toJS();
  }

  return data;
};

export const valuesToSearchableSelect = (data = [], searchValue, searchLabel, locale) => {
  return data.reduce((prev, current) => {
    return [
      ...prev,
      (isImmutable(current) ? current.entrySeq() : Object.entries(current)).reduce(
        (optionPrev, [key, val]) => ({
          ...optionPrev,
          ...(key === searchValue && { value: val }),
          ...(key === "disabled" && { disabled: val }),
          ...(key === searchLabel && {
            label: isImmutable(val) || typeof val === "object" ? displayNameHelper(val, locale) : val
          })
        }),
        {}
      )
    ];
  }, []);
};

export const compare = (prev, next) => prev.equals(next);

// Based on https://github.com/react-hook-form/react-hook-form/blob/v4.4.8/src/utils/getPath.ts
export const getObjectPath = (path, values) => {
  const getInnerPath = (value, key, isObject) => {
    const pathWithIndex = isObject ? `${path ? `${path}.` : path}${key}` : `${path}[${key}]`;

    return value === null || !["object", "function"].includes(typeof value)
      ? pathWithIndex
      : getObjectPath(pathWithIndex, value);
  };

  if (!values) return [];

  return Object.entries(values)
    .map(([key, value]) => getInnerPath(value, key, typeof values === "object" && !Array.isArray(values)))
    .flat(Infinity);
};

export const invalidCharRegexp = /[*!@#%$^]/;

export const normalizeTimezone = date => {
  const offset = new Date().getTimezoneOffset() / 60;

  return addHours(date, offset);
};

export const toServerDateFormat = (date, options) => {
  const includeTime = options?.includeTime || false;
  const normalize = options?.normalize !== false;

  const normalizedDate = includeTime && normalize ? normalizeTimezone(date) : date;

  return format(normalizedDate, includeTime ? API_DATE_TIME_FORMAT : API_DATE_FORMAT);
};

export const endOfDay = date => parseISO(date.toISOString().replace(/T.+/, "").concat("T23:59:59Z"));

export const hasApiDateFormat = value =>
  isString(value) && Boolean(value.match(ISO_DATE_REGEX) || value.match(ISO_DATE_TIME_REGEX));

export const reduceMapToObject = data => {
  if (data && (data?.length || data?.size) <= 0) {
    return null;
  }

  if (data instanceof List || List.isList(data)) {
    return data.reduce((acc, curr) => [...acc, reduceMapToObject(curr)], []);
  }

  if (data instanceof Map || Map.isMap(data)) {
    return data.entrySeq().reduce((acc, [key, value]) => ({ ...acc, [key]: reduceMapToObject(value) }), {});
  }

  if (data instanceof Record || Record.isRecord(data)) {
    return data
      .toSeq()
      .entrySeq()
      .reduce((acc, [key, value]) => ({ ...acc, [key]: reduceMapToObject(value) }), {});
  }

  return data;
};
