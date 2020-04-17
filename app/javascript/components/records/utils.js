/* eslint-disable import/prefer-default-export */

import { Map } from "immutable";
import pickBy from "lodash/pickBy";

export const cleanUpFilters = filters => {
  const filterSelector = filters instanceof Map ? filters.toJS() : filters;

  const filtersArray = pickBy(filterSelector, value => {
    const isMap = Map.isMap(value);

    return !(
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      ((isMap || typeof value === "object") &&
        Object.values(isMap ? value.toJS() : value).includes(null))
    );
  });

  const result = Object.entries(filtersArray).reduce((acum, filter) => {
    const [key, value] = filter;
    const filterObject = acum;

    if (Array.isArray(value)) {
      filterObject[key] = value.join(",");
    } else if (
      typeof value === "object" &&
      !Object.values(value).includes(null)
    ) {
      const valueConverted = {};

      Object.entries(value).forEach(keys => {
        const [k, v] = keys;

        if (["from", "to"].includes(k)) {
          valueConverted[k] = v;
        }
      });

      if (typeof value.value !== "undefined") {
        filterObject[value.value] = valueConverted;
      }
    } else {
      filterObject[key] = value;
    }

    return filterObject;
  }, {});

  return result;
};
