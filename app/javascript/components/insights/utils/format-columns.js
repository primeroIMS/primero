import max from "lodash/max";
import uniq from "lodash/uniq";

import formattedDate from "./formatted-date";
import sortByDate from "./sort-by-date";
import translateColumn from "./translate-column";

const columnsHeading = (formattedKeys, column, index) =>
  formattedKeys.map(key => {
    const splitted = key.split(".");

    return translateColumn(column, splitted[index]);
  });

export default (formattedKeys, columns, i18n) => {
  const items = columns.map((column, index) => {
    const uniqueItems = sortByDate(
      uniq(columnsHeading(formattedKeys, column, index).concat(i18n.t("report.total")))
    ).map(columnHeading => formattedDate(columnHeading, i18n));

    return { items: uniqueItems };
  });

  const colspan = max(items.map((item, index) => (index === 1 ? item.items.length : 0)));

  return items.map((item, index) => {
    if (columns.length === 1) {
      return item.items;
    }

    return {
      ...item,
      colspan: index === columns.length - 1 ? 0 : colspan
    };
  });
};
