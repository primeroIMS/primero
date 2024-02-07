// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import css from "./styles.css";
import StackedPercentageBarMeter from "./components/stacked-percentage-bar-meter";
import StackedPercentageBarLabel from "./components/stacked-percentage-bar-label";

const Component = ({ percentages, className }) => {
  if (percentages.length > 2) throw new Error("StackedPercentageBar components only support a max of 2 percentages");

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
  className: PropTypes.string,
  percentages: PropTypes.array
};

export default Component;
