import React from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect, SingleAggregateMetric } from "components/key-performance-indicators";

export default function SupervisorToCaseworkerRatio() {
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
      title="Supervisor To Caseworker Ratio"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <SingleAggregateMetric
        value="3.1:1"
        label="Caseworkers per supervisor"
      />
    </OptionsBox>
  );
}
