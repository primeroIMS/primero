import React from "react";
import { fromJS } from "immutable";
import { DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";

const TimeFromCaseOpenToCloseHighRisk = ({}) => {
  const columns = ["Time", "Percent of Cases"];

  const rows = [
    ["<1 month", "80%"],
    ["1-3 months", "10%"],
    ["3-6 months", "0%"],
    [">6 months", "10%"]
  ];

  const currentMonth = new Date();

  currentMonth.setMonth(currentMonth.getMonth() - 3);
  const dateRanges = [
    {
      value: "1-month",
      name: "Current Month",
      from: currentMonth,
      to: new Date()
    }
  ];

  return (
    <OptionsBox
      title="Time From Case Open To Case Close (High Risk)"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <DashboardTable columns={columns} data={fromJS(rows)} />
    </OptionsBox>
  );
};

export default TimeFromCaseOpenToCloseHighRisk;
