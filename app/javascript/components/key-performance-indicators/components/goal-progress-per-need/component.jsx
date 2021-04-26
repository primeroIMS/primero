import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import PercentageCell from "../percentage-cell";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();
  const columns = [
    {
      name: "need",
      label: i18n.t(`key_performance_indicators.${identifier}.need`)
    },
    {
      name: "percentage",
      label: " ",
      options: {
        customBodyRender: PercentageCell
      }
    }
  ];

  const rows = data.get("data").map(row => columns.map(column => row.get(column.name)));

  return <KpiTable columns={columns} data={rows} />;
};

Component.displayName = "GoalProgressPerNeed";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "goal_progress_per_need",
  { data: [] },
  ACTIONS.KPI_GOAL_PROGRESS_PER_NEED
)(Component);
