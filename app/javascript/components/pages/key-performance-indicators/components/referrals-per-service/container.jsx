import React from "react";
import { fromJS } from "immutable";
import { DateRangeSelect, CommonDateRanges } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";

export default function ReferralsPerService({ }) {
  let columns = ['Service', 'Referrals'];

  let rows = [
    ['Safe house / Shelter', 3],
    ['Health / Medical', 19],
    ['Psycholosocial', 16],
    ['Legal assistance', 0],
    ['Safety & security', 0],
    ['Livelihood services', 1]
  ];

  let commonDateRanges = CommonDateRanges.from(new Date());

  let dateRanges = [
    commonDateRanges.CurrentMonth
  ];

  return (
    <OptionsBox
      title="Referrals Per Service"
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
