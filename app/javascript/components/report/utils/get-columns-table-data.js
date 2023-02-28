import isEmpty from "lodash/isEmpty";

import removeTotalKeys from "./remove-total-keys";
import formatColumns from "./format-columns";
import getColumnsObjects from "./get-column-objects";

export default (data, i18n) => {
  if (isEmpty(data.report_data)) {
    return [];
  }

  const columns = data.fields.filter(field => field.position.type === "vertical");
  const qtyRows = data.fields.filter(field => field.position.type === "horizontal").length;
  const columnsObjects = getColumnsObjects(data.report_data, qtyRows);
  const totalabel = i18n.t("report.total");
  const keysWithoutTotal = removeTotalKeys(totalabel, columnsObjects);
  const renderColumns = formatColumns(keysWithoutTotal, columns, i18n).flat();

  return renderColumns;
};
