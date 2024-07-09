// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import max from "lodash/max";
import uniq from "lodash/uniq";
import isNil from "lodash/isNil";

import formattedDate from "./formatted-date";
import translateColumn from "./translate-column";
import sortTableData from "./sort-table-data";

const columnsHeading = (keys, column, index) =>
  keys.reduce((acc, key) => {
    if (!isNil(key[index])) {
      return [...acc, translateColumn(column, key[index])];
    }

    return acc;
  }, []);

export default (keys, columns, ageRanges, groupAges, i18n) => {
  const items = columns.map((column, index) => {
    const sortedData = sortTableData({
      field: column,
      data: uniq(columnsHeading(keys, column, index)) || [],
      ageRanges,
      groupAges,
      incompleteDataLabel: i18n.t("report.incomplete_data"),
      locale: i18n.locale
    });

    return {
      items: sortedData.map(columnHeading => formattedDate(columnHeading, i18n)).concat(i18n.t("report.total"))
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
