import formatRows from "./format-rows";
import getColumnsTableData from "./get-columns-table-data";
import getRowsTableData from "./get-rows-table-data";
import translateReportData from "./translate-report-data";

export default (report, i18n, { agencies, locations }) => {
  const { fields } = report.toJS();
  const translatedReport = translateReportData(report.toJS(), i18n, { agencies, locations });
  const translatedReportWithAllFields = {
    ...translatedReport,
    fields
  };

  const newColumns = getColumnsTableData(translatedReportWithAllFields, i18n);
  const newRows = getRowsTableData(translatedReportWithAllFields, i18n);

  const columns = newColumns;
  const rows = report.toJS()?.fields?.filter(field => field.position.type === "horizontal");
  const values = formatRows(newRows, rows, columns);

  return { columns, values };
};
