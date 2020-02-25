import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { withRouter } from "react-router-dom";
import { TablePercentageBar, DateRangeSelect, DateRange} from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useI18n } from "components/i18n";
import { subMonths, addMonths, startOfMonth } from "date-fns";

function ReportingDelay({ fetchReportingDelay, reportingDelay }) {
  let i18n = useI18n();

  let today = new Date();
  let dateRanges = [
    new DateRange(
      '3-months',
      i18n.t('key_performance_indicators.time_periods.last_3_months'),
      startOfMonth(subMonths(today, 2)),
      startOfMonth(addMonths(today, 1))),
    new DateRange(
      '6-months',
      i18n.t('key_performance_indicators.time_periods.last_6_months'),
      startOfMonth(subMonths(today, 5)),
      startOfMonth(addMonths(today, 1))),
    new DateRange(
      '1-year',
      i18n.t('key_performance_indicators.time_periods.last_1_year'),
      startOfMonth(subMonths(today, 12)),
      startOfMonth(addMonths(today, 1)))
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchReportingDelay(currentDateRange);
  }, [currentDateRange]);

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

  return (
    <OptionsBox
      title="Reporting Delay"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
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
