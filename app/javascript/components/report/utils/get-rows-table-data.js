import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import isNil from "lodash/isNil";
import first from "lodash/first";
import last from "lodash/last";

import buildColumnPaths from "./build-column-paths";
import sortTableData from "./sort-table-data";

const getQueryPath = path => {
  const queryPath = [...path];

  queryPath.pop();
  queryPath.push("query");

  return queryPath;
};

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
      accum.push([key, true, { count: total, query: value.query }]);

      const sortedTable = sortTableData({
        field: last(rows),
        data: Object.keys(value),
        ageRanges,
        groupAges: data.group_ages,
        incompleteDataLabel,
        locale: i18n.locale
      });

      const result = sortedTable
        .filter(val => !["_total", i18n.t("report.total"), "query"].includes(val))
        .map(rowDisplayName => {
          const values = columnPaths.map(path => {
            const queryPath = getQueryPath(path);
            const query = get(value[rowDisplayName], queryPath, []);

            return { count: get(value[rowDisplayName], path, 0), query };
          });
          const rowTotal = isNil(value[rowDisplayName]._total)
            ? value[rowDisplayName][i18n.t("report.total")]
            : value[rowDisplayName]._total;

          return [rowDisplayName, false, ...values, { count: rowTotal, query: value[rowDisplayName].query }];
        });

      // Set rest of keys
      const innerRows = result.map(innerRow => {
        const [enDate, ...enValues] = innerRow;

        return [enDate, ...enValues];
      });

      accum.push(...innerRows);
    } else {
      const values = columnPaths.map(column => {
        const queryPath = getQueryPath(column);
        const query = get(value, queryPath, []);

        return { count: get(value, column, 0), query };
      });

      accum.push([key, false, ...values, { count: total, query: value.query }]);
    }
  });

  return accum;
};
