import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { DateRangeSelect } from "components/key-performance-indicators/date-range-select";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import React, { useEffect, useState } from "react";

function asKeyPerformanceIndicator(identifier, defaultData) {
  return (Visualizer) => {
    // TODO: need a better name for this
    let enhance = connect(
      (state) => ({ data: selectors.forKPI(identifier, state, defaultData) }),
      { fetchData: actions.dataFetcherFor(identifier) }
    );

    return enhance(({ data, fetchData, dateRanges, ...props }) => {
      let i18n = useI18n();

      let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

      useEffect(() => {
        fetchData(currentDateRange);
      }, [currentDateRange]);

      return (
        <OptionsBox
          title={i18n.t(`key_performance_indicators.${identifier}.title`)}
          action={
            <DateRangeSelect
              ranges={dateRanges}
              selectedRange={currentDateRange}
              setSelectedRange={setCurrentDateRange}
              withCustomRange
            />
          }
        >
          <Visualizer data={data} {...props} />
        </OptionsBox>
      );
    });
  };
}

function TimeFromCaseOpenToClose({ data, identifer }) {
  let columns = [{
    name: 'time',
    label: i18n.t(`key_performance_indicators.${identifier}.time`)
  }, {
    name: 'percent',
    label: i18n.t(`key_performance_indicators.${identifier}.percent`)
  }];

  let rows = data.get("data")
    .map(row => columns.map(column => row.get(column.name)))

  /*
  let rows = [
    ['<1 month', '65%'],
    ['1-3 months', '13%'],
    ['3-6 months', '9%'],
    ['>6 months', '7%']
  ];
  */

  return (<DashboardTable columns={columns} rows={rows}/>);
}

export default asKeyPerformanceIndicator(
  'time_from_case_open_to_close',
  { data: [] }
)(TimeFromCaseOpenToClose)
