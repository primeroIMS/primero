import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { withRouter } from "react-router-dom";
import { DateRangeSelect } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect  } from "react-redux";
import React, { useEffect } from "react";

function NumberOfIncidents({ fetchNumberOfIncidents, numberOfIncidents }) {
  useEffect(() => {
    fetchNumberOfIncidents();
  }, []);

  let columns = [{
    name: "reporting_site",
    label: "Reporting Site"
  }].concat(numberOfIncidents.get("dates").map(date => {
    return {
      name: date,
      label: date
    };
  }).toJS());

  // data needs to be in an array as object data as rows to mui-datatables
  // is depreciated.
  let rows = numberOfIncidents.get("data")
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
      title="Number of Incidents"
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
    numberOfIncidents: selectors.numberOfIncidents(state)
  };
};

const mapDispatchToProps = {
  fetchNumberOfIncidents: actions.fetchNumberOfIncidents
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NumberOfIncidents)
);
