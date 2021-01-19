import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Help } from "@material-ui/icons";
import makeStyles from "@material-ui/styles/makeStyles";

import OptionsBox from "../../../dashboard/options-box";
import { useI18n } from "../../../i18n";
import actionsForKPI from "../../action-creators";
import selectorsForKPI from "../../selectors";
import DateRangeSelect from "../date-range-select";

import styles from "./styles.css";

const asKeyPerformanceIndicator = (identifier, defaultData) => {
  return Visualizer => {
    const enhance = connect(state => ({ data: selectorsForKPI(identifier, state, defaultData) }), {
      fetchData: actionsForKPI(identifier)
    });

    return enhance(({ data, fetchData, dateRanges, ...props }) => {
      const i18n = useI18n();
      const css = makeStyles(styles)();

      const [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

      useEffect(() => {
        fetchData(currentDateRange);
      }, [currentDateRange]);

      const [helptextOpen, setHelptextOpen] = useState(false);
      const handleHelptextClick = () => setHelptextOpen(!helptextOpen);

      return (
        <OptionsBox
          title={i18n.t(`key_performance_indicators.${identifier}.title`)}
          action={
            <DateRangeSelect
              i18n={i18n}
              ranges={dateRanges}
              selectedRange={currentDateRange}
              setSelectedRange={setCurrentDateRange}
              withCustomRange
            />
          }
        >
          <Visualizer identifier={identifier} data={data} {...props} />
          <div>
            <div title={i18n.t(`key_performance_indicators.helptext.helptext`)} className={css.helptextHeader}>
              <Help className={css.helptextButton} onClick={handleHelptextClick} />
            </div>
            {helptextOpen && (
              <p className={css.helptextBody}>{i18n.t(`key_performance_indicators.${identifier}.helptext`)}</p>
            )}
          </div>
        </OptionsBox>
      );
    });
  };
};

export default asKeyPerformanceIndicator;
