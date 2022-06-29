import isEmpty from "lodash/isEmpty";
import sortBy from "lodash/sortBy";
import first from "lodash/first";

import { CASES_BY_SOCIAL_WORKER_COLUMNS } from "../components/cases-by-social-worker/constants";
import { dataToJS } from "../../../../libs";

export default (indicators, i18n) => {
  const newData = dataToJS(indicators);

  if (isEmpty(newData)) {
    return {};
  }

  const rows = Object.keys(Object.values(newData.indicators)[0]);
  const [, ...columnValues] = CASES_BY_SOCIAL_WORKER_COLUMNS;
  const firstColumn = CASES_BY_SOCIAL_WORKER_COLUMNS[0];

  const data = sortBy(
    rows.map(row => {
      const values = columnValues.map(column => newData.indicators[column][row]?.count);

      return [row, ...values];
    }),
    [elem => first(elem)]
  );

  const query = data.map(row => {
    const socialWorker = first(row);
    const values = columnValues
      .map(column => ({ [column]: newData.indicators[column][socialWorker]?.query }))
      .reduce((prev, curr) => ({ ...curr, ...prev }), {});

    return { [firstColumn]: socialWorker, ...values };
  });

  return {
    columns: CASES_BY_SOCIAL_WORKER_COLUMNS.map(name => ({
      name,
      label: i18n.t(`dashboard.${name}`)
    })),
    data,
    query
  };
};
