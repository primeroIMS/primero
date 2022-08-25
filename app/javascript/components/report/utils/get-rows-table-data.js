import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import isNil from "lodash/isNil";

import formattedDate from "./formatted-date";
import sortByDate from "./sort-by-date";
import buildColumnPaths from "./build-column-paths";

export default (data, columns, i18n) => {
  if (isEmpty(data.report_data)) {
    return [];
  }
  const rows = data.fields.filter(field => field.position.type === "horizontal");
  const accum = [];
  const rowEntries = sortByDate(Object.entries(data.report_data), true);

  const columnPaths = buildColumnPaths(columns, i18n);

  rowEntries.forEach(entry => {
    const [key, value] = entry;
    const qtyOfParentKeys = rows.length;
    const total = isNil(value._total) ? value[i18n.t("report.total")] : value._total;

    if (qtyOfParentKeys >= 2) {
      accum.push([key, true, total]);
      const result = sortByDate(Object.keys(value))
        .filter(val => !["_total", i18n.t("report.total")].includes(val))
        .map(rowDisplayName => {
          const values = columnPaths.map(child => get(value[rowDisplayName], child, 0));
          const rowTotal = isNil(value[rowDisplayName]._total)
            ? value[rowDisplayName][i18n.t("report.total")]
            : value[rowDisplayName]._total;

          return [rowDisplayName, false, ...values, rowTotal];
        });

      // Set rest of keys
      const innerRows = [...sortByDate(result, true)].map(innerRow => {
        const [enDate, ...enValues] = innerRow;
        const dateOrExistingKey = formattedDate(enDate, i18n);

        return [dateOrExistingKey, ...enValues];
      });

      accum.push(...innerRows);
    } else {
      const values = columnPaths.map(column => get(value, column, 0));

      const dateOrKey = formattedDate(key, i18n);

      accum.push([dateOrKey, false, ...values, total]);
    }
  });

  return accum;
};
