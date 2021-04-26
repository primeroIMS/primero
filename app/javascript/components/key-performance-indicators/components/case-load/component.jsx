import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  const columns = [
    {
      name: "case_load",
      label: i18n.t(`key_performance_indicators.${identifier}.case_load`),
      transform: time => i18n.t(`key_performance_indicators.${identifier}.${time}`)
    },
    {
      name: "percent",
      label: i18n.t(`key_performance_indicators.${identifier}.percent`),
      transform: percent => `${(percent * 100).toFixed(0)}%`
    }
  ];

  const rows = data.get("data").map(row => columns.map(column => column.transform(row.get(column.name))));

  return <KpiTable columns={columns} data={rows} />;
};

Component.displayName = "CaseLoad";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("case_load", { data: [] }, ACTIONS.KPI_CASE_LOAD)(Component);
