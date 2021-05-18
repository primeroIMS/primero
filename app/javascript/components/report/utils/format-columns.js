import max from "lodash/max";
import uniq from "lodash/uniq";

import { TOTAL } from "../constants";

import formattedDate from "./formatted-date";
import sortByDate from "./sort-by-date";
import translateColumn from "./translate-column";

export default (formattedKeys, columns, i18n) => {
  const items = columns.map((column, index) => {
    const columnsHeading = i =>
      formattedKeys.map(c => {
        const splitted = c.split(".");

        return translateColumn(column, splitted[i]);
      });

    const uniqueItems = sortByDate(uniq(columnsHeading(index).concat(TOTAL))).map(columnHeading => {
      return formattedDate(columnHeading, i18n);
    });

    return {
      items: uniqueItems
    };
  });

  const colspan = max(items.map((item, index) => (index === 1 ? item.items.length : 0)));

  return items.map((f, index) => {
    if (columns.length === 1) {
      return f.items;
    }

    return {
      ...f,
      colspan: index === columns.length - 1 ? 0 : colspan
    };
  });
};
