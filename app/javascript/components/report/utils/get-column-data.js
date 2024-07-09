// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import uniq from "lodash/uniq";
import get from "lodash/get";

import sortByDate from "./sort-by-date";

const getColumnData = (column, data, i18n, qtyColumns, qtyRows) => {
  const totalLabel = i18n.t("report.total");
  const keys = sortByDate(Object.keys(data));

  if (qtyRows >= 2 && qtyColumns > 0) {
    const firstRow = keys;
    const secondRow = uniq(firstRow.flatMap(row => Object.keys(data[row]).filter(key => key !== totalLabel)));

    return keys.reduce((firstRowAccum, firstRowCurr) => {
      const secondRowAccum = secondRow
        .map(secondLevel => {
          return get(data, [firstRowCurr, secondLevel, column, totalLabel]) || 0;
        })
        .reduce((acc, curr) => acc + curr);

      return [...firstRowAccum, secondRowAccum];
    }, []);
  }

  return keys
    .filter(key => key !== totalLabel)
    .map(key => {
      if (data[key][column] && data[key][column][totalLabel]) {
        return data[key][column][totalLabel];
      }

      if (data[key][column]) {
        return getColumnData(column, data[key], i18n, qtyColumns, qtyRows);
      }

      return 0;
    })
    .flat();
};

export default (column, data, i18n, qtyColumns, qtyRows) => getColumnData(column, data, i18n, qtyColumns, qtyRows);
