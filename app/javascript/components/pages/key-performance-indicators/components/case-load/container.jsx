import React from "react";
import { fromJS } from "immutable";
import { DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";

export default function CaseLoad({ }) {
  let columns = ['Case Load', 'Percent of Cases'];

  let rows = [
    ['<10 open cases', '15%'],
    ['<20 open cases', '65%'],
    ['21-30 open cases', '15%'],
    ['>30 open cases', '5%']
  ];
  
  let currentMonth = new Date();
  currentMonth.setMonth(currentMonth.getMonth() - 3)
  let dateRanges = [{
    value: '1-month',
    name: 'Current Month',
    from: currentMonth,
    to: new Date()
  }]

  return (
    <OptionsBox
      title="Case Load"
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
        data={fromJS(rows)}
      />
    </OptionsBox>
  );
}
