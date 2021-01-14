import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import SingleAggregateMetric from "../single-aggregate-metric";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const AverageReferrals = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <SingleAggregateMetric
      value={data.get("data").get("average_referrals")}
      label={i18n.t(`key_performance_indicators.${identifier}.label`)}
    />
  );
};

AverageReferrals.displayName = 'AverageReferrals';

AverageReferrals.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("average_referrals", {
  data: { average_referrals: 0 }
})(AverageReferrals);
