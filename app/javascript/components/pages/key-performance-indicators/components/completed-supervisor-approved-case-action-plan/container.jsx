import React from "react";
import { OptionsBox } from "components/dashboard";
import { StackedPercentageBar } from "components/key-performance-indicators";

export default function CompletedSupervisorApprovedCaseActionPlan() {
  return (
    <OptionsBox
      title="Completed Action Plan Approved by Supervisor"
    >
      <StackedPercentageBar
        percentages={[{ percentage: 0.5, label: "Completed action plan approved by supervisor" }]}
      />
    </OptionsBox>
  );
}
