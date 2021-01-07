import isEmpty from "lodash/isEmpty";

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

  const data = rows.map(row => {
    const values = columnValues.map(column => newData.indicators[column][row].count);

    return [row, ...values];
  });

  const query = rows.map(row => {
    const values = columnValues
      .map(column => ({ [column]: newData.indicators[column][row].query }))
      .reduce((prev, curr) => ({ ...curr, ...prev }), {});

    return { [firstColumn]: row, ...values };
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
