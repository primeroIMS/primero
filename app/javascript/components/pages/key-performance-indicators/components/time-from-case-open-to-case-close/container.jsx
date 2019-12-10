import React from "react";
import { fromJS } from "immutable";
import { DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";

export default function TimeFromCaseOpenToClose({ }) {
  let columns = ['Time', 'Percent of Cases'];

  let rows = [
    ['<1 month', '65%'],
    ['1-3 months', '13%'],
    ['3-6 months', '9%'],
    ['>6 months', '7%']
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
      title="Time From Case Open To Case Close"
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
