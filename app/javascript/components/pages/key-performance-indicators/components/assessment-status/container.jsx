import React from "react";
import { useI18n } from "components/i18n";
import { StackedPercentageBar } from "components/key-performance-indicators";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function AssessmentStatus({ data, identifier}) {
  let i18n = useI18n();

  return (
      <StackedPercentageBar
        percentages={[
          {
            percentage: data.get('data').get('completed'),
            label: i18n.t(`key_performance_indicators.${identifier}.completed`)
          }
        ]}
      />
 );
}

export default asKeyPerformanceIndicator(
  'assessment_status',
  { data: { completed: 0 } }
)(AssessmentStatus);
