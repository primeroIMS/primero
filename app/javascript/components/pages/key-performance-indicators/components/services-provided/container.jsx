import React from "react";
import { useI18n } from "components/i18n";
import { DashboardTable } from "components/dashboard";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function ServicesProvided({ data, identifier }) {
  let i18n = useI18n();

  let columns = [{
    name: 'service',
    label: i18n.t(`key_performance_indicators.${identifier}.service`)
  }, {
    name: 'count',
    label: i18n.t(`key_performance_indicators.${identifier}.count`)
  }];

  let rows = data.get('data').get('services_provided')
    .map(row => columns.map(column => row.get(column.name)));

  return (
    <DashboardTable
      columns={columns}
      data={rows}
    />
  );
}

export default asKeyPerformanceIndicator(
  'services_provided',
  { data: { services_provided: [] } }
)(ServicesProvided);
