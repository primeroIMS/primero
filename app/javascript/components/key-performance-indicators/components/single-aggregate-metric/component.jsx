import PropTypes from "prop-types";

import css from "./styles.css";

const Component = ({ value, label }) => {
  const shouldTrucate = value?.toFixed && value.toString().indexOf(".") > -1;
  const displayValue = shouldTrucate ? value.toFixed(1) : value;

  return (
    <div className={css.root}>
      <h1 className={css.value}>{displayValue}</h1>
      <span className={css.label}>{label}</span>
    </div>
  );
};

Component.displayName = "SingleAggregateMetric";

Component.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Component;
