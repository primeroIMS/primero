import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";

import styles from "./styles.css";
import StackedPercentageBarMeter from "./stacked-percentage-bar-meter";
import StackedPercentageBarLabel from "./stacked-percentage-bar-label";

const StackedPercentageBar = ({ percentages, className }) => {
  const css = makeStyles(styles)();

  if (percentages.length > 2)
    throw "StackedPercentageBar components only support a max of 2 percentages";

  const percentagedToRender = percentages.filter(
    descriptor => descriptor.percentage > 0
  );

  return (
    <div className={css.StackedPercentageBarContainer}>
      <div className={[css.StackedPercentageBar, className].join(" ")}>
        {percentagedToRender.map((percentageDescriptor, i) => (
          <StackedPercentageBarMeter
            realPercent={percentageDescriptor.percentage}
            key={i}
            css={css}
          />
        ))}
      </div>
      <div className={css.StackedPercentageBarLabels}>
        {percentages.map((percentageDescriptor, i) => (
          <StackedPercentageBarLabel 
            realPercent={percentageDescriptor.percentage}
            key={i}
            css={css}
          />
        ))}
      </div>
    </div>
  );
};

export default StackedPercentageBar;
