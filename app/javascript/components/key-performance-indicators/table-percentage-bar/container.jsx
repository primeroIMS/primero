import React from 'react';
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function TablePercentageBar({ percentage, className}) {
  let css = makeStyles(styles)();

  // Set a minimum of 5 percent so that there is always something
  // visible. It's not meant to be a super accurate assessment but
  // a quick visual assessment if we're using a percentage bar.
  const percentageValue = Math.max(5, percentage * 100);
  const isZero = percentage === 0;

  const barClassNames = [css.TablePercentageBarContainer, className].join(" ");
  const fillingClassNames = [
    css.TablePercentageBarComplete,
    isZero ? css.emptyColor : css.filledColor
  ].join(" ");

  return (
    <div className={barClassNames}>
      <div class={css.TablePercentageBar}>
        <div
          className={fillingClassNames}
          style={{ width: percentageValue + "%" }}></div>
      </div>
    </div>
  )
}
