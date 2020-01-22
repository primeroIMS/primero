import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect, batch } from "react-redux";
import React, { useEffect } from "react";

function NumberOfCases({ fetchNumberOfCases, numberOfCases }) {
  useEffect(() => {
    batch(() => {
      fetchNumberOfCases();
    });
  }, []);

  let columns = [{
    name: "reporting_site",
    label: "Reporting Site"
  }].concat(numberOfCases.get("dates").map(date => {
    return {
      name: date,
      label: date
    };
  }).toJS());

  // data needs to be in an array as object data as rows to mui-datatables
  // is depreciated.
  let rows = numberOfCases.get("data")
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
      title="Number of Cases"
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
    numberOfCases: selectors.numberOfCases(state)
  };
};

const mapDispatchToProps = {
  fetchNumberOfCases: actions.fetchNumberOfCases
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberOfCases);
