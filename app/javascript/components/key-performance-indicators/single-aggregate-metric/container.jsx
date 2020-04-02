import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function SingleAggregateMetric({ value, label }) {
  let css = makeStyles(styles)();
  let displayValue = value?.toFixed
    ? value.toFixed(1)
    : value;

  return (
    <div className={css.root}>
      <h1 className={css.value}>{displayValue}</h1>
      <span className={css.label}>{label}</span>
    </div>
  );
}
