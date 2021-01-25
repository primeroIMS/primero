import React from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  const columns = [
    {
      name: "service",
      label: i18n.t(`key_performance_indicators.${identifier}.service`)
    },
    {
      name: "count",
      label: i18n.t(`key_performance_indicators.${identifier}.count`)
    }
  ];

  const rows = data
    .get("data")
    .get("services_provided")
    .map(row => columns.map(column => row.get(column.name)));

  return <KpiTable columns={columns} data={rows} />;
};

Component.displayName = "ServicesProvided";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "services_provided",
  { data: { services_provided: [] } },
  ACTIONS.KPI_SERVICES_PROVIDED
)(Component);
