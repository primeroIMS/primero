import React from 'react';
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function StackedPercentageBar({ percentages, className }) {
  let css = makeStyles(styles)();

  if (percentages.length > 2)
    throw "StackedPercentageBar components only support a max of 2 percentages";

  // only render percentages above 0.
  // TODO: Figure out what to do if first percentage is 0 as it will
  // force all labels after it to overlap. We could use a min-width?
  let percentagedToRender = percentages
    .filter(descriptor => descriptor.percentage > 0)

  return (
    <div className={css.StackedPercentageBarContainer}>
      <div className={[css.StackedPercentageBar, className].join(" ")}>
        {
            percentagedToRender.map((percentageDescriptor, i) => {
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
          percentages.map((percentageDescriptor, i) => {
            let percentage = percentageDescriptor.percentage * 100;

            return (
              <div className={css.StackedPercentageBarLabelContainer} style={{ width: percentage > 0 ? percentage + "%" : 'auto' }}>
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
