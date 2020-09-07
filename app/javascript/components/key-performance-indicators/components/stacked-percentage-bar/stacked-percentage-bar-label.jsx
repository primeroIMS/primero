import React from "react";

const StackedPercentageBarLabel = ({ realPercent, label, key, css }) => {
  const percentage = realPercent * 100;

  return (
    <div
      key={key}
      className={css.StackedPercentageBarLabelContainer}
      style={{ width: percentage > 0 ? `${percentage}%` : "auto" }}
    >
      <div>
        <h1 className={css.StackedPercentageBarLabelPercentage}>
          {`${percentage.toFixed(0)}%`}
        </h1>
      </div>
      <div className={css.StackedPercentageBarLabel}>
        {label}
      </div>
    </div>
  );
}

export default StackedPercentageBarLabel;
