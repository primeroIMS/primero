import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import SingleAggregateMetric from "../single-aggregate-metric";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const AverageFollowupMeetingsPerCase = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <SingleAggregateMetric
      value={data.get("data").get("average_meetings")}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
};

AverageFollowupMeetingsPerCase.displayName = 'AverageFollowupMeetingsPerCase';

AverageFollowupMeetingsPerCase.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("average_followup_meetings_per_case", {
  data: { average_meetings: 0 }
})(AverageFollowupMeetingsPerCase);
