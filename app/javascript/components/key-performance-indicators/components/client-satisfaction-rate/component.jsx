import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";

import StackedPercentageBar from "../stacked-percentage-bar";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <StackedPercentageBar
      percentages={[
        {
          percentage: data.get("data").get("satisfaction_rate"),
          label: i18n.t(`key_performance_indicators.${identifier}.label`)
        }
      ]}
    />
  );
};

Component.displayName = "ClientSatisfactionRate";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("client_satisfaction_rate", {
  data: { satisfaction_rate: 0 }
})(Component);
