import PropTypes from "prop-types";

import { DashboardTable } from "../../../dashboard";

// Simple wrapper over DashboardTable to insulate Kpis from future
// changes to serve the Dashbaord needs. Can be migrated to MUIDataTable
// at some point when the needs differ enough.
const Component = ({ columns, data }) => <DashboardTable columns={columns} data={data} pathname="" />;

Component.displayName = "KpiTable";

Component.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default Component;
