import React from "react";
import { useI18n } from "components/i18n";
import { SingleAggregateMetric } from "components/key-performance-indicators";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function SupervisorToCaseworkerRatio({ data, identifier }) {
  let i18n = useI18n();
  let supervisors = data.get('data').get('supervisors');
  let caseWorkers = data.get('data').get('case_workers');

  return (
    <SingleAggregateMetric
      value={`${caseWorkers}:${supervisors}`}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
}

export default asKeyPerformanceIndicator(
  'supervisor_to_caseworker_ratio',
  { data: { supervisors: 0, case_workers: 0 } }
)(SupervisorToCaseworkerRatio)
