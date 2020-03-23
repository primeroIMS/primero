import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { addMonths, startOfMonth } from "date-fns";
import { OptionsBox } from "components/dashboard";
import { DateRangeSelect, DateRange } from "components/key-performance-indicators";
import { StackedPercentageBar } from "components/key-performance-indicators";

function CompletedCaseActionPlan({ fetchCompletedCaseActionPlans, completedCaseActionPlans }) {
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
    fetchCompletedCaseActionPlans(currentDateRange);
  }, [currentDateRange]);

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.completed_case_action_plan.title')}
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
            percentage: completedCaseActionPlans.get('data').get('completed'),
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
