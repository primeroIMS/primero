import React from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";

const TimeFromCaseOpenToClose = ({ data, identifier }) => {
  const i18n = useI18n();

  const columns = [
    {
      name: "time",
      label: i18n.t(`key_performance_indicators.${identifier}.time`),
      transform: time =>
        i18n.t(`key_performance_indicators.time_periods.${time}`)
    },
    {
      name: "percent",
      label: i18n.t(`key_performance_indicators.${identifier}.percent`),
      transform: percent => `${(percent * 100).toFixed(0)}%`
    }
  ];

  const rows = data
    .get("data")
    .map(row => columns.map(column => column.transform(row.get(column.name))));

  return <KpiTable columns={columns} data={rows} />;
};

TimeFromCaseOpenToClose.displayName = "TimeFromCaseOpenToClose";

TimeFromCaseOpenToClose.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator("time_from_case_open_to_close", {
  data: []
})(TimeFromCaseOpenToClose);