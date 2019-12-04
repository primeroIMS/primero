import React from "react";
import { OptionsBox } from "components/dashboard";
import { StackedPercentageBar } from "components/key-performance-indicators";

export default function CompletedCaseActionPlan() {
  return (
    <OptionsBox
      title="Completed Case Action Plan"
    >
      <StackedPercentageBar
        percentages={[{ percentage: 0.5, label: "Completed Case Action Plan" }]}
      />
    </OptionsBox>
  );
}
