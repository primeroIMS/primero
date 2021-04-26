import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import SingleAggregateMetric from "../single-aggregate-metric";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <SingleAggregateMetric
      value={data.get("data").get("average_referrals")}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
};

Component.displayName = "AverageReferrals";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "average_referrals",
  { data: { average_referrals: 0 } },
  ACTIONS.KPI_AVERAGE_REFERRALS
)(Component);
