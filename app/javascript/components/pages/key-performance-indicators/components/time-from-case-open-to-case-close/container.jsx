import React from "react";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";
import { DashboardTable } from "components/dashboard";
import { useI18n } from "components/i18n";

function TimeFromCaseOpenToClose({ data, identifier }) {
  let i18n = useI18n();

  let columns = [{
    name: 'time',
    label: i18n.t(`key_performance_indicators.${identifier}.time`),
    transform: (time) => i18n.t(`key_performance_indicators.time_periods.${time}`)
  }, {
    name: 'percent',
    label: i18n.t(`key_performance_indicators.${identifier}.percent`),
    transform: (percent) => (percent * 100).toFixed(0) + '%'
  }];

  let rows = data.get("data")
    .map(row => columns.map(column => column.transform(row.get(column.name))))

  return (<DashboardTable columns={columns} data={rows}/>);
}

export default asKeyPerformanceIndicator(
  'time_from_case_open_to_close',
  { data: [] }
)(TimeFromCaseOpenToClose)
