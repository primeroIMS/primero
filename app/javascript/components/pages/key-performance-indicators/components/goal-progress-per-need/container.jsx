import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { TablePercentageBar, DateRangeSelect, CommonDateRanges } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";

// TODO: This shoud be renamed: ProgressTowardsGoals and refererences to
// needs should be goals. The language here is a little confusing but
// fundementally this is about goals (which are about needs) and we should
// try and keep the language used here within the goals domain. The backend
// can handle the translation from needs to goals.
function GoalProgressPerNeed({ fetchGoalProgressPerNeed, goalProgressPerNeed }) {
  let i18n = useI18n();
  let css = makeStyles({
    root: {
      '> tbody > tr > td:first-child': {
        minWidth: '10em',
        width: '20%'
      }
    }
  })();

  let commonDateRanges = CommonDateRanges.from(new Date());

  let dateRanges = [
    commonDateRanges.AllTime
  ];

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchGoalProgressPerNeed(currentDateRange);
  }, [currentDateRange]);

  let columns = [
    {
      name: "need",
      label: i18n.t('key_performance_indicators.goal_progress_per_need.need')
    }, {
      name: "percentage",
      label: " ",
      options: {
        customBodyRender: (value) => {
          return (<TablePercentageBar percentage={value} />);
        }
      }
    }
  ];

  let rows = goalProgressPerNeed.get("data")
    .map(row => columns.map(column => row.get(column.name)));

  let test = [
    ['Safe house / shelter', 0.7],
    ['Health / medical', 0.4],
    ['Psychosocial', 0],
    ['Legal assistance', 0.5],
    ['Safety and security', 0.3],
    ['Livelihood', 0.5]
  ];

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.goal_progress_per_need.title')}
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
          disabled
        />
      }
    >
      <DashboardTable
        className={css.root}
        columns={columns}
        data={rows}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    goalProgressPerNeed: selectors.goalProgressPerNeed(state)
  };
};

const mapDispatchToProps = {
  fetchGoalProgressPerNeed: actions.fetchGoalProgressPerNeed
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalProgressPerNeed);
