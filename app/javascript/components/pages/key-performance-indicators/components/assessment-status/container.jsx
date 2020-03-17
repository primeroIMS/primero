import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { subMonths, addMonths, startOfMonth } from "date-fns";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect, DateRange } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

function AssessmentStatus({ fetchAssessmentStatus, assessmentStatus }) {
  let i18n = useI18n();

  let today = new Date();
  let dateRanges = [
    new DateRange(
      'all-time',
      i18n.t('key_performance_indicators.time_periods.all_time'),
      // earliest date representable
      new Date(-8640000000000000),
      startOfMonth(addMonths(today, 1)))
  ]

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchAssessmentStatus(currentDateRange);
  }, [currentDateRange]);

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.assessment_status.title')}
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
      <StackedPercentageBar
        percentages={[
          {
            percentage: assessmentStatus.get('data').get('completed_supervisor_approved'),
            label: i18n.t('key_performance_indicators.assessment_status.completed_supervisor_approved')
          },
          {
            percentage: assessmentStatus.get('data').get('completed_only'),
            label: i18n.t('key_performance_indicators.assessment_status.completed')
          }
        ]}
      />
    </OptionsBox>
 );
}

const mapStateToProps = state => {
  return {
    assessmentStatus: selectors.assessmentStatus(state)
  };
};

const mapDispatchToProps = {
  fetchAssessmentStatus: actions.fetchAssessmentStatus
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(AssessmentStatus);
