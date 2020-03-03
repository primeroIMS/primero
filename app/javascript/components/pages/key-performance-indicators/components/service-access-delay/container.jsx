import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { TablePercentageBar, DateRangeSelect, DateRange} from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useI18n } from "components/i18n";
import { subMonths, addMonths, startOfMonth } from "date-fns";

function ServiceAccessDelay({ fetchServiceAccessDelay, serviceAccessDelay }) {
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
    fetchServiceAccessDelay(currentDateRange);
  }, [currentDateRange]);

  let columns = [
    { name: "delay", label: i18n.t('key_performance_indicators.service_access_delay.delay') },
    { name: "total_incidents", label: i18n.t('key_performance_indicators.service_access_delay.total_incidents') },
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

  let rows = serviceAccessDelay.get("data")
    .map(row => {
      return [
        i18n.t(`key_performance_indicators.time_periods.${row.get('delay')}`),
        row.get('total_incidents'),
        row.get('percentage')
      ]
    })

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.service_access_delay.title')}
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
    serviceAccessDelay: selectors.serviceAccessDelay(state)
  };
};

const mapDispatchToProps = {
  fetchServiceAccessDelay: actions.fetchServiceAccessDelay
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceAccessDelay);
