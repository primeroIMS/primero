import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect, batch } from "react-redux";
import React, { useEffect } from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

function AssessmentStatus({ fetchAssessmentStatus, assessmentStatus }) {
  useEffect(() => {
    batch(() => {
      fetchAssessmentStatus();
    });
  }, []);

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
      title="Assessment Status"
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={dateRanges[0]}
          withCustomRange
        />
      }
    >
      <StackedPercentageBar
        percentages={[
          {
            percentage: assessmentStatus.get('data').get('completed_supervisor_approved'),
            label: 'Completed & Supervisor Approved'
          },
          {
            percentage: assessmentStatus.get('data').get('completed_only'),
            label: 'Completed Only'
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
