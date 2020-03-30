import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function SingleAggregateMetric({ value, label }) {
  let css = makeStyles(styles)();

  return (
    <div className={css.root}>
      <h1 className={css.value}>{value.toFixed(1)}</h1>
      <span className={css.label}>{label}</span>
    </div>
  );
}
