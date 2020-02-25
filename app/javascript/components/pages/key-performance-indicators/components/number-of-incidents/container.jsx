import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { withRouter } from "react-router-dom";
import { DateRangeSelect, DateRange } from "components/key-performance-indicators/date-range-select";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { subMonths, addMonths, startOfMonth } from "date-fns";
import React, { useEffect, useState } from "react";

function NumberOfIncidents({ fetchNumberOfIncidents, numberOfIncidents }) {
  let i18n = useI18n();

  let today = new Date();
  let dateRanges = [
    new DateRange(
      '3-months',
      i18n.t('key_performance_indicators.time_periods.last_3_months'),
      startOfMonth(subMonths(today, 2)),
      startOfMonth(addMonths(today, 1)))
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchNumberOfIncidents(currentDateRange);
  }, [currentDateRange]);

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

  return (
    <OptionsBox
      title="Number of Incidents"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
          disabled
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
