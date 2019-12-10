import React from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

export default function CompletedCaseClosureProcedures() {
  let threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  let dateRanges = [{
    value: '3-months',
    name: 'Last 3 Months',
    from: threeMonthsAgo,
    to: new Date()
  }]

  return (
    <OptionsBox
      title="Completed Case Closure Procedures"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <StackedPercentageBar
        percentages={[{ percentage: 0.89, label: "Completed" }]}
      />
    </OptionsBox>
 );
}
