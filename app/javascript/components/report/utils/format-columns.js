import max from "lodash/max";
import uniq from "lodash/uniq";
import isNil from "lodash/isNil";

import { sortWithSortedArray } from "../../insights-sub-report/utils";

import formattedDate from "./formatted-date";
import sortByDate from "./sort-by-date";
import translateColumn from "./translate-column";

const columnsHeading = (keys, column, index) =>
  keys.reduce((acc, key) => {
    if (!isNil(key[index])) {
      return [...acc, translateColumn(column, key[index])];
    }

    return acc;
  }, []);

export default (keys, columns, ageRanges, groupAges, i18n) => {
  const items = columns.map((column, index) => {
    let uniqueItems = uniq(columnsHeading(keys, column, index));

    if (column.name.startsWith("age") && groupAges) {
      uniqueItems = sortWithSortedArray(uniqueItems, ageRanges, null, i18n.t("report.incomplete_data"));
    } else if (column.option_labels) {
      uniqueItems = sortWithSortedArray(
        uniqueItems,
        column.option_labels[i18n.locale].map(option => option.display_text),
        null,
        i18n.t("report.incomplete_data")
      );
    } else {
      uniqueItems = sortByDate(uniqueItems);
    }

    return {
      items: uniqueItems.map(columnHeading => formattedDate(columnHeading, i18n)).concat(i18n.t("report.total"))
    };
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
