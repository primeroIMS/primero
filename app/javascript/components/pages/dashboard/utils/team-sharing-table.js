import uniq from "lodash/uniq";

import { dataToJS } from "../../../../libs";

export default (dashboard, i18n) => {
  const data = dataToJS(dashboard);

  if (!Object.keys(data).length) {
    return {};
  }
  const { indicators } = data;
  const columns = Object.keys(indicators).reduce((acc, curr) => {
    return [...acc, { name: curr, label: i18n.t(`dashboard.${curr}`) }];
  }, []);

  columns.unshift({
    name: "caseWorker",
    label: i18n.t("dashboard.case_worker")
  });

  const caseWorkers = uniq(
    Object.values(indicators).reduce((acc, curr) => {
      return [...acc, ...Object.keys(curr)];
    }, [])
  );
  const rowsWithValues = key => {
    return caseWorkers.map(caseWorker => {
      const caseWorkerWithValues = columns
        .map(column => {
          if (column.name !== "caseWorker") {
            return {
              [column.name]:
                typeof indicators[column.name] !== "undefined" &&
                Object.prototype.hasOwnProperty.call(
                  indicators[column.name],
                  caseWorker
                )
                  ? indicators[column.name][caseWorker][key]
                  : 0
            };
          }

          return "";
        })
        .reduce((acc, obj) => ({ ...acc, ...obj }));

      return {
        caseWorker,
        ...caseWorkerWithValues
      };
    });
  };

  return {
    columns,
    data: rowsWithValues("count"),
    query: rowsWithValues("query")
  };
};
