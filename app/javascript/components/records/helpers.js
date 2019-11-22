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

  const result = Object.entries(filtersArray).reduce((acum, filter) => {
    const [key, value] = filter;
    const o = acum;

    if (Array.isArray(value)) {
      o[key] = value.join(",");
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
        o[value.value] = valueConverted;
      }
    } else {
      o[key] = value;
    }

    return o;
  }, {});

  return result;
};
