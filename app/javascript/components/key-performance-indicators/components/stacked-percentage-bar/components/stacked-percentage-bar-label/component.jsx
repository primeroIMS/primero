import PropTypes from "prop-types";

const Component = ({ realPercent, label, index, css }) => {
  const percentage = realPercent * 100;
  const style = { width: percentage > 0 ? `${percentage}%` : "auto" };

  return (
    <div key={index} className={css.StackedPercentageBarLabelContainer} style={style}>
      <div>
        <h1 className={css.StackedPercentageBarLabelPercentage}>{`${percentage.toFixed(0)}%`}</h1>
      </div>
      <div className={css.StackedPercentageBarLabel}>{label}</div>
    </div>
  );
};

Component.displayName = "StackedPercentageBarLabel";

Component.propTypes = {
  css: PropTypes.object,
  index: PropTypes.number,
  label: PropTypes.string,
  realPercent: PropTypes.number
};

export default Component;
