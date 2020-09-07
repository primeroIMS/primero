import React from "react";

const StackedPercentageBarMeter = ({ realPercent, key, css }) => {
  const percentage = realPercent * 100;

  return (
    <div
      key={key}
      className={css[`StackedPercentageBar${ key + 1 }Complete`]}
      style={{ width: `${percentage}%` }}
    />
  );
}

export default StackedPercentageBarMeter;
