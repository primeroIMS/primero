import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { DateRangeSelect, CommonDateRanges } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import React, { useEffect, useState } from "react";

function NumberOfIncidents({ fetchNumberOfIncidents, numberOfIncidents }) {
  let i18n = useI18n();
  let commonDateRanges = CommonDateRanges.from(new Date());

  let dateRanges = [
    commonDateRanges.Last3Months
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchNumberOfIncidents(currentDateRange);
  }, [currentDateRange]);

  let columns = [{
    name: "reporting_site",
    label: i18n.t('key_performance_indicators.number_of_incidents.reporting_site'),
  }].concat(numberOfIncidents.get("dates").map(date => {
    return {
      name: date,
      label: i18n.toTime('key_performance_indicators.date_format', date)
    };
  }).toJS());

  // data needs to be in an array as object data as rows to mui-datatables
  // is depreciated.
  let rows = numberOfIncidents.get("data")
    .map(row => columns.map(column => row.get(column.name)))

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.number_of_incidents.title')}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumberOfIncidents);
