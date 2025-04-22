import { MAX_VISIBLE_DASHBOARDS } from "../constants";

const permittedDashboards = ({ columnDashboards, permittedAbilities, tableDashboards }) => {
  const permittedColumnDashboards = columnDashboards.filter(
    dashboard => dashboard.permitted || dashboard.actions.some(action => permittedAbilities.includes(action))
  );

  const permittedTableDashboards = tableDashboards.filter(
    dashboard => dashboard.permitted || dashboard.actions.some(action => permittedAbilities.includes(action))
  );

  const totalColumnDashboards = permittedColumnDashboards.length;

  if (permittedColumnDashboards.length < MAX_VISIBLE_DASHBOARDS) {
    return [
      permittedColumnDashboards.concat(
        permittedTableDashboards.slice(0, MAX_VISIBLE_DASHBOARDS - totalColumnDashboards)
      ),
      permittedTableDashboards.slice(
        MAX_VISIBLE_DASHBOARDS - permittedColumnDashboards.length,
        permittedTableDashboards.length
      )
    ];
  }

  return [permittedColumnDashboards, permittedTableDashboards];
};

export default permittedDashboards;
