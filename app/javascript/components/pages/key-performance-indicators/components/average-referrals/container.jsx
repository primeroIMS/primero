import React from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function AverageReferrals() {
  let css = makeStyles(styles)();

  let threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  let dateRanges = [{
    value: '3-months',
    name: 'Last 3 Months',
    from: threeMonthsAgo,
    to: new Date()
  }]

  return (
    <OptionsBox
      title="Average Referrals"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <div className={css.root}>
        <h1 className={css.value}>2.2</h1>
        <span className={css.label}>Average referrals per case</span>
      </div>
    </OptionsBox>
  );
}
