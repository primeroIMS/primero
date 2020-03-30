import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useI18n } from "components/i18n";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { DateRangeSelect, DateRange } from "components/key-performance-indicators";
import { addMonths, startOfMonth } from "date-fns";

function ServicesProvided({ fetchServicesProvided, servicesProvided }) {
  let i18n = useI18n();

  let today = new Date();
  let dateRanges = [
    new DateRange(
      'all-time',
      i18n.t('key_performance_indicators.time_periods.all_time'),
      // earliest date representable
      new Date(-8640000000000000),
      startOfMonth(addMonths(today, 1)))
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchServicesProvided(currentDateRange);
  }, [currentDateRange]);

  let columns = [{
    name: 'service',
    label: i18n.t('key_performance_indicators.services_provided.service')
  }, {
    name: 'count',
    label: i18n.t('key_performance_indicators.services_provided.count')
  }];
  let rows = servicesProvided.get('data').get('services_provided')
    .map(row => columns.map(column => row.get(column.name)));

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.services_provided.title')}
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
          withCustomRange
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
    servicesProvided: selectors.servicesProvided(state)
  };
};

const mapDispatchToProps = {
  fetchServicesProvided: actions.fetchServicesProvided
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesProvided);
