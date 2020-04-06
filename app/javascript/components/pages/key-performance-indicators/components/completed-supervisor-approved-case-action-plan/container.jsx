import React from "react";
import { useI18n } from "components/i18n";
import { StackedPercentageBar } from "components/key-performance-indicators";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

function CompletedSupervisorApprovedCaseActionPlan({ data, identifier }) {
  let i18n = useI18n();

  return (
      <StackedPercentageBar
        percentages={[
          {
            percentage: data.get('data').get('completed_and_approved'),
            label: i18n.t(`key_performance_indicators.${identifier}.completed_and_approved`)
          }
        ]}
      />
  );
}

export default asKeyPerformanceIndicator(
  'completed_supervisor_approved_case_action_plans',
  { data: { completed_and_approved: 0 } }
)(CompletedSupervisorApprovedCaseActionPlan);
