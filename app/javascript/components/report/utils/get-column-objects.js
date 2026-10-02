import omit from "lodash/omit";
import merge from "deepmerge";

import { QUERY_KEY, TOTAL_KEY } from "../constants";

export default (object, qtyRows) => {
  let columnObjects = {};
  // eslint-disable-next-line consistent-return
  const getColumnsObj = (obj, level = 0) => {
    if (level >= qtyRows) {
      return obj;
    }

    const keys = Object.keys(obj);

    // eslint-disable-next-line no-param-reassign
    level += 1;

    for (let i = 0; i < keys.length; i += 1) {
      const columnObj = omit(getColumnsObj(obj[keys[i]], level), QUERY_KEY);

      columnObjects = columnObj ? merge(columnObjects, columnObj) : columnObjects;
    }

    return columnObjects;
  };

  // Removing "_total" and "query" from columns object
  return omit(getColumnsObj(object), [TOTAL_KEY, QUERY_KEY]);
};
