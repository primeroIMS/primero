import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../../libs/permissions";

const Component = ({ data, identifier }) => {
  const i18n = useI18n();

  const toColumn = name => ({
    name,
    label: i18n.t(`key_performance_indicators.${identifier}.${name}`)
  });

  const columns = [
    toColumn("service"),
    toColumn("male"),
    toColumn("female"),
    toColumn("0-11"),
    toColumn("12-17"),
    toColumn(">18"),
    toColumn("disability"),
    toColumn("no_disability"),
    toColumn("count")
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
