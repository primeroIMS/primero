import { Map } from "immutable";
import { pickBy } from "lodash";

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

  Object.entries(filtersArray).forEach(filter => {
    const [key, value] = filter;

    if (Array.isArray(value)) {
      filtersArray[key] = value.join(",");
    } else if (
      typeof value === "object" &&
      !Object.values(value).includes(null)
    ) {
      const valueConverted = {};

      Object.entries(value).forEach(keys => {
        const [k, v] = keys;

        valueConverted[k] = v;
      });
      filtersArray[key] = valueConverted;
    } else {
      filtersArray[key] = value;
    }
  });

  return filtersArray;
};
