import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

function CompletedSupervisorApprovedCaseActionPlan({ fetchCompletedSupervisorApprovedCaseActionPlans, completedSupervisorApprovedCaseActionPlans }) {
  useEffect(() => {
    fetchCompletedSupervisorApprovedCaseActionPlans()
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
      title="Completed Action Plan Approved by Supervisor"
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
            percentage: completedSupervisorApprovedCaseActionPlans.get('data').get('completed_supervisor_approved_case_action_plans'),
            label: "Completed action plan approved by supervisor"
          }
        ]}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    completedSupervisorApprovedCaseActionPlans: selectors.completedSupervisorApprovedCaseActionPlans(state)
  };
};

const mapDispatchToProps = {
  fetchCompletedSupervisorApprovedCaseActionPlans: actions.fetchCompletedSupervisorApprovedCaseActionPlans
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedSupervisorApprovedCaseActionPlan);
