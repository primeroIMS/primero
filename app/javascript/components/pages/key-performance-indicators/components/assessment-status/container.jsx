import React from "react";
import { OptionsBox } from "components/dashboard";
import { StackedPercentageBar } from "components/key-performance-indicators";

export default function AssessmentStatus() {
  return (
    <OptionsBox
      title="Assessment Status"
    >
      <StackedPercentageBar
        percentages={[{ percentage: 0.5, label: "Completed & Supervisor Approved" }, { percentage: 0.26, label: "Completed Only" }]}
      />
    </OptionsBox>
 );
}
