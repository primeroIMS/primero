import React from "react";
import { useI18n } from "components/i18n";
import { DashboardTable } from "components/dashboard";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function CaseLoad({ data, identifier }) {
  let i18n = useI18n();

  let columns = [{
    name: 'case_load',
    label: i18n.t(`key_performance_indicators.${identifier}.case_load`),
    transform: (time) => i18n.t(`key_performance_indicators.${identifier}.${time}`)
  }, {
    name: 'percent',
    label: i18n.t(`key_performance_indicators.${identifier}.percent`),
    transform: (percent) => (percent * 100).toFixed(0) + '%'
  }];

  let rows = data.get("data")
    .map(row => columns.map(column => column.transform(row.get(column.name))))
  
  return (<DashboardTable columns={columns} data={rows} />);
}

export default asKeyPerformanceIndicator(
  'case_load',
  { data: [] }
)(CaseLoad);
