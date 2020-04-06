import * as selectors from "../selectors";
import * as actions from "../action-creators";
import { DateRangeSelect } from "components/key-performance-indicators/date-range-select";
import { OptionsBox } from "components/dashboard";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import React, { useEffect, useState } from "react";

export default function asKeyPerformanceIndicator(identifier, defaultData) {
  return (Visualizer) => {
    // TODO: need a better name for this
    let enhance = connect(
      (state) => ({ data: selectors.forKPI(identifier, state, defaultData) }),
      { fetchData: actions.forKPI(identifier) }
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
