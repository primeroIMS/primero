import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect, CommonDateRanges, SingleAggregateMetric } from "components/key-performance-indicators";

function AverageFollowupMeetingsPerCase({ fetchAverageFollowupMeetingsPerCase, averageFollowupMeetingsPerCase }) {
  let i18n = useI18n();
  let commonDateRanges = CommonDateRanges.from(new Date());

  let dateRanges = [
    commonDateRanges.Last3Months
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchAverageFollowupMeetingsPerCase(currentDateRange);
  }, [currentDateRange]);

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.average_followup_meetings_per_case.title')}
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
          withCustomRange
          disabled
        />
      }
    >
      <SingleAggregateMetric
        value={averageFollowupMeetingsPerCase.get('data').get('average_meetings')}
        label={i18n.t('key_performance_indicators.average_followup_meetings_per_case.label')}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    averageFollowupMeetingsPerCase: selectors.averageFollowupMeetingsPerCase(state)
  };
};

const mapDispatchToProps = {
  fetchAverageFollowupMeetingsPerCase: actions.fetchAverageFollowupMeetingsPerCase
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AverageFollowupMeetingsPerCase);
