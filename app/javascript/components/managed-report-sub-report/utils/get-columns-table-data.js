import isEmpty from "lodash/isEmpty";

import cleanKeys from "./clean-keys";
import formatColumns from "./format-columns";
import getColumnsObjects from "./get-column-objects";
import sortByDate from "./sort-by-date";

export default (data, i18n) => {
  if (isEmpty(data.report_data)) {
    return [];
  }

  const columns = data.fields.filter(field => field.position.type === "vertical");
  const qtyRows = data.fields.filter(field => field.position.type === "horizontal").length;
  const columnsObjects = getColumnsObjects(data.report_data, qtyRows);
  const cleaned = sortByDate(cleanKeys(i18n, columnsObjects, columns));
  const renderColumns = formatColumns(cleaned, columns, i18n).flat();

  return renderColumns;
};
