/* eslint-disable import/prefer-default-export */

import qs from "qs";

import { OR_FIELDS } from "../index-filters";

export const buildFilter = (queryValue, isManager = false) => {
  const value = queryValue.reduce((acum, obj) => {
    const [filterName, filterValue] = obj.split("=");

    const valueList = filterValue.split(",");
    const val = valueList.length > 1 ? valueList : [filterValue];

    return {
      ...acum,
      ...(OR_FIELDS.includes(filterName) && !isManager
        ? { or: { [filterName]: filterValue } }
        : { [filterName]: val })
    };
  }, {});

  return qs.stringify(value);
};
