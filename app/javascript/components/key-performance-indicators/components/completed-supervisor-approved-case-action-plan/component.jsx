import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import StackedPercentageBar from "../stacked-percentage-bar";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const CompletedSupervisorApprovedCaseActionPlan = ({ data, identifier }) => {
  const i18n = useI18n();

  return (
    <StackedPercentageBar
      percentages={[
        {
          percentage: data.get("data").get("completed_and_approved"),
          label: i18n.t(
            `key_performance_indicators.${identifier}.completed_and_approved`
          )
        }
      ]}
    />
  );
};

CompletedSupervisorApprovedCaseActionPlan.displayName = 'CompletedSupervisorApprovedCaseActionPlan';

CompletedSupervisorApprovedCaseActionPlan.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "completed_supervisor_approved_case_action_plans",
  { data: { completed_and_approved: 0 } }
)(CompletedSupervisorApprovedCaseActionPlan);
