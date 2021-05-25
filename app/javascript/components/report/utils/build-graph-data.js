import { REPORT_FIELD_TYPES } from "../../reports-form/constants";

import buildDataSet from "./build-data-set";
import getColumns from "./get-columns";
import getLabels from "./get-labels";
import translateReportData from "./translate-report-data";

export default (report, i18n, { agencies, locations }) => {
  const reportData = report.toJS();

  if (!reportData.report_data) {
    return {};
  }
  const { fields } = reportData;
  const translatedReport = translateReportData(reportData, i18n);
  const qtyColumns = fields.filter(field => field.position.type === REPORT_FIELD_TYPES.vertical).length;
  const qtyRows = fields.filter(field => field.position.type === REPORT_FIELD_TYPES.horizontal).length;
  const columns = getColumns(translatedReport.report_data, i18n, qtyColumns, qtyRows);

  const graphData = {
    description: translatedReport.description ? translatedReport.description[i18n.locale] : "",
    data: {
      labels: getLabels(columns, translatedReport.report_data, i18n, fields, qtyColumns, qtyRows, {
        agencies,
        locations
      }),
      datasets: buildDataSet(columns, translatedReport.report_data, i18n, fields, qtyColumns, qtyRows, {
        agencies,
        locations
      })
    }
  };

  return graphData;
};
