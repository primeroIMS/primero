import sortByDate from "./sort-by-date";

const getColumnData = (column, data, i18n, qtyColumns, qtyRows) => {
  const totalLabel = i18n.t("report.total");
  const keys = sortByDate(Object.keys(data));

  if (qtyRows >= 2 && qtyColumns > 0) {
    const firstRow = keys;
    const secondRow = Object.keys(data[firstRow[0]]).filter(key => key !== totalLabel);

    return keys.reduce((firstRowAccum, firstRowCurr) => {
      const secondRowAccum = secondRow
        .map(secondLevel => {
          return data[firstRowCurr][secondLevel][column][totalLabel];
        })
        .reduce((acc, curr) => acc + curr);

      return [...firstRowAccum, secondRowAccum];
    }, []);
  }

  return keys
    .filter(key => key !== totalLabel)
    .map(key => {
      const columnValue = data[key][column]
        ? data[key][column][totalLabel]
        : getColumnData(column, data[key], i18n, qtyColumns, qtyRows);

      return columnValue;
    })
    .flat();
};

export default (column, data, i18n, qtyColumns, qtyRows) => getColumnData(column, data, i18n, qtyColumns, qtyRows);
