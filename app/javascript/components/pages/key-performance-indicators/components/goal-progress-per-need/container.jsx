import React from "react";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import { TablePercentageBar } from "components/key-performance-indicators";
import { DashboardTable } from "components/dashboard";
import { asKeyPerformanceIndicator } from "../../as-key-performance-indiciator";

// TODO: This shoud be renamed: ProgressTowardsGoals and refererences to
// needs should be goals. The language here is a little confusing but
// fundementally this is about goals (which are about needs) and we should
// try and keep the language used here within the goals domain. The backend
// can handle the translation from needs to goals.
function GoalProgressPerNeed({ data, identifier }) {
  let i18n = useI18n();
  let css = makeStyles({
    root: {
      '> tbody > tr > td:first-child': {
        minWidth: '10em',
        width: '20%'
      }
    }
  })();

  let columns = [
    {
      name: "need",
      label: i18n.t(`key_performance_indicators.${identifier}.need`)
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

  let rows = data.get("data")
    .map(row => columns.map(column => row.get(column.name)));

  return (
    <DashboardTable
      className={css.root}
      columns={columns}
      data={rows}
    />
  );
}

export default asKeyPerformanceIndicator(
  'goal_progress_per_need',
  { data: [] }
)(GoalProgressPerNeed);
