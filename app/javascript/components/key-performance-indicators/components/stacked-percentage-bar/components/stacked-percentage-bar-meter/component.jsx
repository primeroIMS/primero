import React from "react";
import PropTypes from "prop-types";

const StackedPercentageBarMeter = ({ realPercent, index, css }) => {
  const percentage = realPercent * 100;

  return (
    <div
      key={index}
      className={css[`StackedPercentageBar${ index + 1 }Complete`]}
      style={{ width: `${percentage}%` }}
    />
  );
};

StackedPercentageBarMeter.displayName = "StackedPercentageBarMeter";

StackedPercentageBarMeter.propTypes = {
  realPercent: PropTypes.number,
  index: PropTypes.numnber,
  css: PropTypes.object
};

export default StackedPercentageBarMeter;
