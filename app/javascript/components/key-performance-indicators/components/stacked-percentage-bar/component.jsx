import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import styles from "./styles.css";
import StackedPercentageBarMeter from "./components/stacked-percentage-bar-meter";
import StackedPercentageBarLabel from "./components/stacked-percentage-bar-label";

const Component = ({ percentages, className }) => {
  const css = makeStyles(styles)();

  if (percentages.length > 2) throw "StackedPercentageBar components only support a max of 2 percentages";

  const percentagedToRender = percentages.filter(descriptor => descriptor.percentage > 0);

  return (
    <div className={css.StackedPercentageBarContainer}>
      <div className={[css.StackedPercentageBar, className].join(" ")}>
        {percentagedToRender.map((percentageDescriptor, index) => (
          <StackedPercentageBarMeter
            key={percentageDescriptor.label}
            realPercent={percentageDescriptor.percentage}
            index={index}
            css={css}
          />
        ))}
      </div>
      <div className={css.StackedPercentageBarLabels}>
        {percentages.map((percentageDescriptor, index) => (
          <StackedPercentageBarLabel
            key={percentageDescriptor.label}
            realPercent={percentageDescriptor.percentage}
            label={percentageDescriptor.label}
            index={index}
            css={css}
          />
        ))}
      </div>
    </div>
  );
};

Component.displayName = "StackedPercentageBar";

Component.propTypes = {
  percentages: PropTypes.array,
  className: PropTypes.string
};

export default Component;
