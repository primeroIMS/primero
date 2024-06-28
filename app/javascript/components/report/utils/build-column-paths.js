// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (columns, i18n) => {
  const hasObject = columns.some(column => typeof column === "object");
  const labelTotal = i18n.t("report.total");

  if (hasObject) {
    const [columns1, columns2] = columns.map(column =>
      column.items.filter(elem => !["_total", labelTotal].includes(elem))
    );

    return columns1.flatMap(column1 => [
      ...columns2.map(column2 => [`${column1}`, `${column2}`, labelTotal]),
      [column1, labelTotal]
    ]);
  }

  return columns
    .filter(column => !["_total", labelTotal].includes(column))
    .map(column => [`${column}`, `${labelTotal}`]);
};
