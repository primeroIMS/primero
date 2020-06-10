import React from 'react';
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function TablePercentageBar({ percentage, className}) {
  let css = makeStyles(styles)();

  // Set a minimum of 5 percent so that there is always something
  // visible. It's not meant to be a super accurate assessment but
  // a quick visual assessment if we're using a percentage bar.
  const percentageValue = percentage * 100;
  const isSmall = percentage < 0.1;

  const containerClasses = [css.TablePercentageBarContainer, className].join(" ");
  const foregroundClasses = [
    css.TablePercentageBarComplete,
    isSmall && css.small || ''
  ].join(" ");

  return (
    <div className={containerClasses}>
      <div class={css.TablePercentageBar}>
        { isSmall && percentageValue.toFixed(0) + "%" }
        <div
          className={foregroundClasses}
          style={{ width: percentageValue + "%" }}
        >
          { !isSmall && percentageValue.toFixed(0) + "%" }
        </div>
      </div>
    </div>
  )
}
