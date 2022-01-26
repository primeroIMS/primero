import formatRows from "./format-rows";
import getColumnsTableData from "./get-columns-table-data";
import getRowsTableData from "./get-rows-table-data";
import translateReportData from "./translate-report-data";

export default (report, i18n, { agencies, locations }) => {
  const reportData = report.toJS();
  const translatedReport = translateReportData(reportData, i18n, { agencies, locations });
  const translatedReportWithAllFields = {
    ...translatedReport,
    fields: reportData.fields
  };

  const newColumns = getColumnsTableData(translatedReportWithAllFields, i18n);
  const newRows = getRowsTableData(translatedReportWithAllFields, newColumns, i18n);

  const columns = newColumns;
  const rows = reportData?.fields?.filter(field => field.position.type === "horizontal");
  const values = formatRows(newRows, rows, columns);

  return { columns, values };
};
