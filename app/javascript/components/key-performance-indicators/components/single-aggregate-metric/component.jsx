import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

const SingleAggregateMetric = ({ value, label }) => {
  const css = makeStyles(styles)();
  const shouldTrucate = value?.toFixed && value.toString().indexOf(".") > -1;
  const displayValue = shouldTrucate ? value.toFixed(1) : value;

  return (
    <div className={css.root}>
      <h1 className={css.value}>{displayValue}</h1>
      <span className={css.label}>{label}</span>
    </div>
  );
};

SingleAggregateMetric.displayName = "SingleAggregateMetric";

SingleAggregateMetric.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string
}

export default SingleAggregateMetric;
