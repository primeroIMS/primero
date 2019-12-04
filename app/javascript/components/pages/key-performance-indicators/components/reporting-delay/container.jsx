import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { withRouter } from "react-router-dom";
import { TablePercentageBar, DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect, batch } from "react-redux";
import React, { useEffect } from "react";

function ReportingDelay({ fetchReportingDelay, reportingDelay }) {
  useEffect(() => {
    batch(() => {
      fetchReportingDelay();
    });
  }, []);

  let columns = [
    { name: "delay", label: "Delay" },
    { name: "total_cases", label: "Total Cases"},
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

  let rows = reportingDelay.get("data")
    .map(row => columns.map(column => row.get(column.name)))

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
      title="Reporting Delay"
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportingDelay)
);
