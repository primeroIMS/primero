import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";

import styles from "./styles.css";

const SingleAggregateMetric = ({ value, label }) => {
  const css = makeStyles(styles)();
  const displayValue = value?.toFixed ? value.toFixed(1) : value;

  return (
    <div className={css.root}>
      <h1 className={css.value}>{displayValue}</h1>
      <span className={css.label}>{label}</span>
    </div>
  );
}

export default SingleAggregateMetric;
