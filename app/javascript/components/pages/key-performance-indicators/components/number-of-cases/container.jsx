import React from "react";
import { useI18n } from "components/i18n";
import { DashboardTable } from "components/dashboard";

import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

const NumberOfCases = ({ data, identifier }) => {
  const i18n = useI18n();

  const columns = [
    {
      name: "reporting_site",
      label: i18n.t(`key_performance_indicators.${identifier}.reporting_site`)
    }
  ].concat(
    data
      .get("dates")
      .map(date => {
        return {
          name: date,
          label: i18n.toTime("key_performance_indicators.date_format", date)
        };
      })
      .toJS()
  );

  // data needs to be in an array as object data as rows to mui-datatables
  // is depreciated.
  const rows = data
    .get("data")
    .map(row => columns.map(column => row.get(column.name)));

  return <DashboardTable columns={columns} data={rows} />;
};

export default asKeyPerformanceIndicator("number_of_cases", {
  dates: [],
  data: []
})(NumberOfCases);
