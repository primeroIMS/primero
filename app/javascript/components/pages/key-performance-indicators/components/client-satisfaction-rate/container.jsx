import React from "react";
import { useI18n } from "components/i18n";
import { StackedPercentageBar } from "components/key-performance-indicators";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function ClientSatisfactionRate({ data, identifier }) {
  let i18n = useI18n();

  return (
    <StackedPercentageBar
      percentages={[{
        percentage: data.get('data').get('satisfaction_rate'),
        label: i18n.t(`key_performance_indicators.${identifier}.label`)
      }]}
    />
  );
}

export default asKeyPerformanceIndicator(
  'client_satisfaction_rate',
  { data: { satisfaction_rate: 0 } }
)(ClientSatisfactionRate);
