import React from "react";
import { OptionsBox } from "components/dashboard";
import {
  DateRangeSelect,
  SingleAggregateMetric
} from "components/key-performance-indicators";

const ActiveCaseworkers = () => {
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
      title="Active Caseworkers"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <SingleAggregateMetric value="32" label="Caseworkers" />
    </OptionsBox>
  );
};

export default ActiveCaseworkers;
