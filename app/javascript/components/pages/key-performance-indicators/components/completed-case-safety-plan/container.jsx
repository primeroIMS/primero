import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

function CompletedCaseSafetyPlan({ fetchCompletedCaseSafetyPlans, completedCaseSafetyPlans }) {
  useEffect(() => {
    fetchCompletedCaseSafetyPlans();
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
      title="Completed Case Safety Plan"
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
            percentage: completedCaseSafetyPlans.get('data').get('completed_case_safety_plans'),
            label: "Completed Case Safety Plan"
          }
        ]}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    completedCaseSafetyPlans: selectors.completedCaseSafetyPlans(state)
  };
};

const mapDispatchToProps = {
  fetchCompletedCaseSafetyPlans: actions.fetchCompletedCaseSafetyPlans
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedCaseSafetyPlan);
