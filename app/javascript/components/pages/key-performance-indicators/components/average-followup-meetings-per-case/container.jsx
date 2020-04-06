import React from "react";
import { useI18n } from "components/i18n";
import { SingleAggregateMetric } from "components/key-performance-indicators";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function AverageFollowupMeetingsPerCase({ data, identifier }) {
  let i18n = useI18n();

  return (
    <SingleAggregateMetric
      value={data.get('data').get('average_meetings')}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
}

export default asKeyPerformanceIndicator(
  'average_followup_meetings_per_case',
  { data: { average_meetings: 0 } }
)(AverageFollowupMeetingsPerCase);
