import React from "react";
import PropTypes from "prop-types";

const Component = ({ realPercent, index, css }) => {
  const percentage = realPercent * 100;

  return (
    <div
      key={index}
      className={css[`StackedPercentageBar${ index + 1 }Complete`]}
      style={{ width: `${percentage}%` }}
    />
  );
};

Component.displayName = "StackedPercentageBarMeter";

Component.propTypes = {
  realPercent: PropTypes.number,
  index: PropTypes.numnber,
  css: PropTypes.object
};

export default Component;
