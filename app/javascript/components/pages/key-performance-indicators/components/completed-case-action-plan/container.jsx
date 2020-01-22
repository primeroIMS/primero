import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

function CompletedCaseActionPlan({ fetchCompletedCaseActionPlans, completedCaseActionPlans }) {
  useEffect(() => {
    fetchCompletedCaseActionPlans()
  }, [])

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
      title="Completed Case Action Plan"
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
            percentage: completedCaseActionPlans.get('data').get('completed_case_action_plans'),
            label: "Completed Case Action Plan"
          }
        ]}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    completedCaseActionPlans: selectors.completedCaseActionPlans(state)
  };
};

const mapDispatchToProps = {
  fetchCompletedCaseActionPlans: actions.fetchCompletedCaseActionPlans
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedCaseActionPlan);
