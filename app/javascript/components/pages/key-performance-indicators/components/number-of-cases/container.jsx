import React from "react";
import { useI18n } from "components/i18n";
import { DashboardTable } from "components/dashboard";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function NumberOfCases({ data, identifier }) {
  let i18n = useI18n();

  let columns = [{
    name: "reporting_site",
    label: i18n.t(`key_performance_indicators.${identifier}.reporting_site`),
  }].concat(data.get("dates").map(date => {
    return {
      name: date,
      label: i18n.toTime('key_performance_indicators.date_format', date)
    };
  }).toJS());

  // data needs to be in an array as object data as rows to mui-datatables
  // is depreciated.
  let rows = data.get("data")
    .map(row => columns.map(column => row.get(column.name)));

  return (
      <DashboardTable
        columns={columns}
        data={rows}
      />
  );
}

export default asKeyPerformanceIndicator(
  'number_of_cases',
  { dates: [], data: [] }
)(NumberOfCases);
