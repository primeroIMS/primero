import React from "react";
import { fromJS } from "immutable";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";

export default function CaseClosureRate() {
  let columns = ['Reporting Site', 'Case Closures'];

  let rows = fromJS([
    ['Site #1', 10],
    ['Site #2', 2],
    ['Site #3', 4],
    ['Site #4', 16]
  ]);

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
      title="Case Closure Rate"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <DashboardTable
        columns={columns}
        data={rows}
      />
    </OptionsBox>
  );
}
