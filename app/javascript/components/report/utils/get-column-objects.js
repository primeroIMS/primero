import isPlainObject from "lodash/isPlainObject";
import merge from "deepmerge";

import { QUERY_KEY, TOTAL_KEY } from "../constants";

const META_KEYS = [TOTAL_KEY, QUERY_KEY];

const omitRecursively = value =>
  !isPlainObject(value)
    ? value
    : Object.keys(value)
        .filter(key => !META_KEYS.includes(key))
        .reduce((acc, key) => ({ ...acc, [key]: omitRecursively(value[key]) }), {});

export default (object, qtyRows) => {
  let columnObjects = {};
  // eslint-disable-next-line consistent-return
  const getColumnsObj = (obj, level = 0) => {
    if (level >= qtyRows) {
      // Remove "_total" and "query" keys
      return omitRecursively(obj, META_KEYS);
    }

    // Do not search for columns in "_total" and "query" keys
    const keys = Object.keys(obj).filter(key => !META_KEYS.includes(key));

    // eslint-disable-next-line no-param-reassign
    level += 1;

    for (let i = 0; i < keys.length; i += 1) {
      const columnObj = getColumnsObj(obj[keys[i]], level)

      columnObjects = columnObj ? merge(columnObjects, columnObj) : columnObjects;
    }

    return columnObjects;
  };

  return getColumnsObj(object);
};
