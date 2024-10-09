// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export const buildFiltersApi = filters => {
  const excludeDefaultFiltersKeys = ["short", "per", "page", "fields", "filters_category"];

  return filters.reduce((acc, filter) => {
    const [key, value] = filter;
    const isArray = Array.isArray(value);
    const isObject = typeof value === "object";

    if (
      value === undefined ||
      value === null ||
      (isArray && value.length <= 0) ||
      (isObject && Object.keys(value).length <= 0) ||
      excludeDefaultFiltersKeys.includes(key)
    ) {
      return acc;
    }
    const newValue = isArray || isObject ? value : [value.toString()];

    return [...acc, { name: key, value: newValue }];
  }, []);
};

export const buildFiltersState = filters => {
  return filters.reduce((obj, props) => {
    const o = obj;

    o[props.name] = props.value;

    return o;
  }, {});
};
