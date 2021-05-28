import isEmpty from "lodash/isEmpty";

import { REPORT_FIELD_TYPES } from "../../reports-form/constants";

import formattedDate from "./formatted-date";
import getColors from "./get-colors";
import getColumnData from "./get-column-data";
import getTranslatedKey from "./get-translated-key";
import sortByDate from "./sort-by-date";

export default (columns, data, i18n, fields, qtyColumns, qtyRows, { agencies, locations }) => {
  const totalLabel = i18n.t("report.total");
  const dataResults = [];
  const field =
    fields.length > 1
      ? fields.find(reportField => reportField.position.type === REPORT_FIELD_TYPES.vertical)
      : fields.shift();

  if (!isEmpty(columns)) {
    sortByDate(columns).forEach((column, index) => {
      const label = getTranslatedKey(column, field, { agencies, locations });

      dataResults.push({
        label: formattedDate(label, i18n),
        data: getColumnData(column, data, i18n, qtyColumns, qtyRows),
        backgroundColor: getColors(index)
      });
    });
  } else {
    dataResults.push({
      label: totalLabel,
      data: Object.keys(data).map(column => data[column][totalLabel]),
      backgroundColor: getColors(0)
    });
  }

  return dataResults;
};
