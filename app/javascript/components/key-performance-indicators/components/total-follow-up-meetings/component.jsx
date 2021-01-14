import React from "react";
import PropTypes from "prop-types";
import { OptionsBox } from "components/dashboard";
import DateRangeSelect from "../date-range-select";
import SingleAggregateMetric from "../single-aggregate-metric";

const TotalFollowupMeetings = () => {
  const threeMonthsAgo = new Date();

  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const dateRanges = [
    {
      value: "3-months",
      name: "Last 3 Months",
      from: threeMonthsAgo,
      to: new Date()
    }
  ];

  return (
    <OptionsBox
      title="Total Follow-Up Meetings"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <SingleAggregateMetric value="45" label="Total follow-up meetings" />
    </OptionsBox>
  );
};

export default TotalFollowupMeetings;
