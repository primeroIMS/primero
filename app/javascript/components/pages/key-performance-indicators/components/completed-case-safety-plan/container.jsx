import React from "react";
import { OptionsBox } from "components/dashboard";
import { StackedPercentageBar } from "components/key-performance-indicators";

export default function CompletedCaseSafetyPlan() {
  return (
    <OptionsBox
      title="Completed Case Safety Plan"
    >
      <StackedPercentageBar
        percentages={[{ percentage: 0.5, label: "Completed Case Safety Plan" }]}
      />
    </OptionsBox>
  );
}
