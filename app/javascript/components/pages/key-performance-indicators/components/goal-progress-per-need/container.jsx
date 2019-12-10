import React from "react";
import { fromJS } from "immutable";
import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { TablePercentageBar, DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";

function GoalProgressPerNeed({ }) {
  let columns = [
    { name: "need", label: "Needs" },
    {
      name: "percentage",
      label: "",
      options: {
        customBodyRender: (value) => {
          return (<TablePercentageBar percentage={value} />);
        }
      }
    }
  ];

  let rows = fromJS([
    ['Safe house / shelter', 0.7],
    ['Health / medical', 0.4],
    ['Psychosocial', 0],
    ['Legal assistance', 0.5],
    ['Safety and security', 0.3],
    ['Livelihood', 0.5]
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
      title="Goal Progress per Need (Completed Case Action Plan)"
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

const mapStateToProps = state => {
  return {
    reportingDelay: selectors.reportingDelay(state)
  };
};

const mapDispatchToProps = {
  fetchReportingDelay: actions.fetchReportingDelay
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalProgressPerNeed);
