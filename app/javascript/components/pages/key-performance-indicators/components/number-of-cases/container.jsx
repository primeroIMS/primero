import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { DateRangeSelect, DateRange } from "components/key-performance-indicators/date-range-select";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useI18n } from "components/i18n";
import { subMonths } from "date-fns";

function NumberOfCases({ fetchNumberOfCases, numberOfCases }) {
  let i18n = useI18n();

  let today = new Date();
  let dateRanges = [
    new DateRange(
      '3-months',
      i18n.t('key_performance_indicators.time_periods.last_3_months'),
      subMonths(today, 3),
      today)
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchNumberOfCases(currentDateRange);
  }, [currentDateRange]);

  let localizeDate = (date) => i18n.toTime('key_performance_indicators.date_format', date);

  let columns = [{
    name: "reporting_site",
    label: i18n.t('key_performance_indicators.number_of_cases.reporting_site'),
    customBodyRender: localizeDate
  }].concat(numberOfCases.get("dates").map(date => {
    return {
      name: date,
      customHeadRender: localizeDate
    };
  }).toJS());

  // data needs to be in an array as object data as rows to mui-datatables
  // is depreciated.
  // TODO: Some of this data my need translating, if it's a date?
  let rows = numberOfCases.get("data")
    .map(row => columns.map(column => row.get(column.name)));

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.number_of_cases.title')}
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          withCustomRange
          setSelectedRange={setCurrentDateRange}
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
