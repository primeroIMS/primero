import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import StackedPercentageBar from "../stacked-percentage-bar";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const AssessmentStatus = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <StackedPercentageBar
      percentages={[
        {
          percentage: data.get("data").get("completed"),
          label: i18n.t(`key_performance_indicators.${identifier}.completed`)
        }
      ]}
    />
  );
};

AssessmentStatus.displayName = 'AssessmentStatus';

AssessmentStatus.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
}

export default asKeyPerformanceIndicator("assessment_status", {
  data: { completed: 0 }
})(AssessmentStatus);
