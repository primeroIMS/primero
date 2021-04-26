import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import SingleAggregateMetric from "../single-aggregate-metric";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <SingleAggregateMetric
      value={data.getIn(["data", "average_meetings"])}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
};

Component.displayName = "AverageFollowupMeetingsPerCase";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "average_followup_meetings_per_case",
  { data: { average_meetings: 0 } },
  ACTIONS.KPI_AVERAGE_FOLLOWUP_MEETINGS_PER_CASE
)(Component);
