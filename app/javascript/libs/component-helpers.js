import { isImmutable, List, Map } from "immutable";
import { addHours, format, parseISO } from "date-fns";

import { API_DATE_FORMAT, API_DATE_TIME_FORMAT } from "../config/constants";

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

export const invalidCharRegexp = new RegExp("[*!@#%$\\^]");

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
