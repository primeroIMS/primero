import React from "react";
import PropTypes from "prop-types";

const StackedPercentageBarLabel = ({ realPercent, label, index, css }) => {
  const percentage = realPercent * 100;

  return (
    <div
      key={index}
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

StackedPercentageBarLabel.displayName = "StackedPercentageBarLabel";

StackedPercentageBarLabel.propTypes = {
  realPercent: PropTypes.number,
  label: PropTypes.string,
  index: PropTypes.number,
  css: PropTypes.object
}

export default StackedPercentageBarLabel;
