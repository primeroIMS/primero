import React from "react";
import { fromJS } from "immutable";
import { DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";

export default function CompletedReferralsPerService({ }) {
  let columns = ['Service', 'Referrals'];

  let rows = [
    ['Safe house / Shelter', 4],
    ['Health / Medical',5],
    ['Psycholosocial', 10],
    ['Legal assistance', 2],
    ['Safety & security', 1],
    ['Livelihood services', 0]
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
      title="Completed Referrals Per Service"
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
