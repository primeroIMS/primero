import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";

import TablePercentageBar from "../table-percentage-bar";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();
  const css = makeStyles({
    root: {
      "> tbody > tr > td:first-child": {
        minWidth: "10em",
        width: "20%"
      }
    }
  })();

  const columns = [
    {
      name: "need",
      label: i18n.t(`key_performance_indicators.${identifier}.need`)
    },
    {
      name: "percentage",
      label: " ",
      options: {
        customBodyRender: value => {
          return <TablePercentageBar percentage={value} />;
        }
      }
    }
  ];

  const rows = data.get("data").map(row => columns.map(column => row.get(column.name)));

  return <KpiTable className={css.root} columns={columns} data={rows} />;
};

Component.displayName = "GoalProgressPerNeed";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("goal_progress_per_need", {
  data: []
})(Component);
