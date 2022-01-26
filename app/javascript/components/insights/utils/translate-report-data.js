import cloneDeep from "lodash/cloneDeep";

import translateData from "./translate-data";

export default (report, i18n, { agencies, locations } = {}) => {
  const translatedReport = cloneDeep(report);
  const { report_data: data, fields } = cloneDeep(report);

  if (translatedReport.report_data) {
    translatedReport.report_data = translateData(data, fields, i18n, {
      agencies,
      locations
    });
  }

  return translatedReport;
};
