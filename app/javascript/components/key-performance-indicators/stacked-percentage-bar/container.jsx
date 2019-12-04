import React from 'react';
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function StackedPercentageBar({ percentages, className }) {
  let css = makeStyles(styles)();

  if (percentages.length > 2)
    throw "StackedPercentageBar components only support a max of 2 percentages";

  return (
    <div className={css.StackedPercentageBarContainer}>
      <div className={[css.StackedPercentageBar, className].join(" ")}>
        {
          percentages.map((percentageDescriptor, i) => {
            let percentage = percentageDescriptor.percentage * 100;

            return (
              <div
                className={css["StackedPercentageBar" + (i + 1) + "Complete"]}
                style={{ width: percentage + "%" }}
              ></div>
            );
          })
        }
      </div>
      <div className={css.StackedPercentageBarLabels}>
        {
          percentages.map((percentageDescriptor) => {
            let percentage = percentageDescriptor.percentage * 100;

            return (
              <div className={css.StackedPercentageBarLabelContainer} style={{ width: percentage + "%" }}>
                <div>
                  <h1 className={css.StackedPercentageBarLabelPercentage}>{percentage + '%'}</h1>
                </div>
                <div className={css.StackedPercentageBarLabel}>{percentageDescriptor.label}</div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}
