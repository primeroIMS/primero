import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";

import TablePercentageBar from "../table-percentage-bar";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  const columns = [
    {
      name: "delay",
      label: i18n.t(`key_performance_indicators.${identifier}.delay`)
    },
    {
      name: "total_incidents",
      label: i18n.t(`key_performance_indicators.${identifier}.total_incidents`)
    },
    {
      name: "percentage",
      label: "",
      options: {
        customBodyRender: value => {
          return <TablePercentageBar percentage={value} />;
        }
      }
    }
  ];

  const rows = data.get("data").map(row => {
    return [
      i18n.t(`key_performance_indicators.time_periods.${row.get("delay")}`),
      row.get("total_incidents"),
      row.get("percentage")
    ];
  });

  return <KpiTable columns={columns} data={rows} />;
};

Component.displayName = "ReportingDelay";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("reporting_delay", { data: [] })(Component);
