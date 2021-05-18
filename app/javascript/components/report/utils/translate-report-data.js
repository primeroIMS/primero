import translateData from "./translate-data";

export default (report, i18n, { agencies, locations } = {}) => {
  const translatedReport = { ...report };

  if (translatedReport.report_data) {
    translatedReport.report_data = translateData(report.report_data, report.fields, i18n, { agencies, locations });
  }

  return translatedReport;
};
