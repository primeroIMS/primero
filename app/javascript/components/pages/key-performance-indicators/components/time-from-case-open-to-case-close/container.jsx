import  { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";
import { DashboardTable } from "components/dashboard";
import React from "react";
import { useI18n } from "components/i18n";

function TimeFromCaseOpenToClose({ data, identifier }) {
  let i18n = useI18n();

  let columns = [{
    name: 'time',
    label: i18n.t(`key_performance_indicators.${identifier}.time`)
  }, {
    name: 'percent',
    label: i18n.t(`key_performance_indicators.${identifier}.percent`)
  }];

  let rows = data.get("data")
    .map(row => columns.map(column => row.get(column.name)))

  /*
  let rows = [
    ['<1 month', '65%'],
    ['1-3 months', '13%'],
    ['3-6 months', '9%'],
    ['>6 months', '7%']
  ];
  */

  return (<DashboardTable columns={columns} rows={rows}/>);
}

export default asKeyPerformanceIndicator(
  'time_from_case_open_to_close',
  { data: [] }
)(TimeFromCaseOpenToClose)
