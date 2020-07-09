import React from "react";
import { OptionsBox } from "components/dashboard";
import {
  DateRangeSelect,
  StackedPercentageBar
} from "components/key-performance-indicators";

const CompletedCaseClosureProcedures = () => {
  const threeMonthsAgo = new Date();

  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const dateRanges = [
    {
      value: "3-months",
      name: "Last 3 Months",
      from: threeMonthsAgo,
      to: new Date()
    }
  ];

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
};

export default CompletedCaseClosureProcedures;
