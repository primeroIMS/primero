import { DateRangeSelect } from "components/key-performance-indicators/date-range-select";
import { OptionsBox } from "components/dashboard";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import React, { useEffect, useState } from "react";

import { forKPI } from "../selectors";

export default function asKeyPerformanceIndicator(identifier, defaultData) {
  return Visualizer => {
    // TODO: need a better name for this
    const enhance = connect(
      state => ({ data: forKPI(identifier, state, defaultData) }),
      { fetchData: forKPI(identifier) }
    );

    return enhance(({ data, fetchData, dateRanges, ...props }) => {
      const i18n = useI18n();

      const [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

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
          <Visualizer identifier={identifier} data={data} {...props} />
        </OptionsBox>
      );
    });
  };
}
