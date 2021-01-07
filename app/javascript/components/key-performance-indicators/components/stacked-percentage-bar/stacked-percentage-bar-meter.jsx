import React from "react";

const StackedPercentageBarMeter = ({ realPercent, index, css }) => {
  const percentage = realPercent * 100;

  return (
    <div
      key={index}
      className={css[`StackedPercentageBar${ index + 1 }Complete`]}
      style={{ width: `${percentage}%` }}
    />
  );
}

export default StackedPercentageBarMeter;
