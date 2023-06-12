import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import isNil from "lodash/isNil";
import first from "lodash/first";
import last from "lodash/last";

import formattedDate from "./formatted-date";
import buildColumnPaths from "./build-column-paths";
import sortTableData from "./sort-table-data";

export default (data, columns, ageRanges, i18n) => {
  if (isEmpty(data.report_data)) {
    return [];
  }

  const incompleteDataLabel = i18n.t("report.incomplete_data");
  const rows = data.fields.filter(field => field.position.type === "horizontal");
  const qtyOfParentKeys = rows.length;
  const accum = [];
  const rowEntries = sortTableData({
    field: first(rows),
    data: Object.entries(data.report_data),
    sortByFn: elem => first(elem),
    ageRanges,
    groupAges: data.group_ages,
    incompleteDataLabel,
    locale: i18n.locale
  });

  const columnPaths = buildColumnPaths(columns, i18n);

  rowEntries.forEach(entry => {
    const [key, value] = entry;
    const total = isNil(value._total) ? value[i18n.t("report.total")] : value._total;

    if (qtyOfParentKeys >= 2) {
      accum.push([key, true, total]);

      const result = sortTableData({
        field: last(rows),
        data: Object.keys(value),
        ageRanges,
        groupAges: data.group_ages,
        incompleteDataLabel,
        locale: i18n.locale
      })
        .filter(val => !["_total", i18n.t("report.total")].includes(val))
        .map(rowDisplayName => {
          const values = columnPaths.map(child => get(value[rowDisplayName], child, 0));
          const rowTotal = isNil(value[rowDisplayName]._total)
            ? value[rowDisplayName][i18n.t("report.total")]
            : value[rowDisplayName]._total;

          return [rowDisplayName, false, ...values, rowTotal];
        });

      // Set rest of keys
      const innerRows = result.map(innerRow => {
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
