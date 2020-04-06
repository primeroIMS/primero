import React from "react";
import { useI18n } from "components/i18n";
import { TablePercentageBar } from "components/key-performance-indicators";
import { DashboardTable } from "components/dashboard";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function ServiceAccessDelay({ data, identifier }) {
  let i18n = useI18n();

  let columns = [
    { name: "delay", label: i18n.t(`key_performance_indicators.${identifier}.delay`) },
    { name: "total_incidents", label: i18n.t(`key_performance_indicators.${identifier}.total_incidents`) },
    {
      name: "percentage",
      label: "",
      options: {
        customBodyRender: (value) => {
          return (<TablePercentageBar percentage={value} />);
        }
      }
    }
  ];

  let rows = data.get("data")
    .map(row => {
      return [
        i18n.t(`key_performance_indicators.time_periods.${row.get('delay')}`),
        row.get('total_incidents'),
        row.get('percentage')
      ]
    })

  return (
    <DashboardTable
      columns={columns}
      data={rows}
    />
  );
}

export default asKeyPerformanceIndicator(
  'service_access_delay',
  { data: [] }
)(ServiceAccessDelay);
