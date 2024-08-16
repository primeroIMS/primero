// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import PropTypes from "prop-types";

import Permission, { RESOURCES } from "../../permissions";
import OptionsBox from "../options-box";
import { dashboardType } from "../../pages/dashboard/utils";
import css from "../../pages/dashboard/components/styles.css";

function DashboardColumns({ columns }) {
  return (
    <div className={css.container} data-testid="dashboard-columns">
      {columns.map((dashboards, index) => (
        <Fragment key={`columns-${dashboards.flatMap(dashboard => dashboard.actions).join("-")}`}>
          <div className={css.optionsBox} data-testid="dashboard-column">
            <OptionsBox flat>
              {dashboards.map(dashboard => {
                const { type, actions, options } = dashboard;
                const Dashboard = dashboardType(type);

                return (
                  <Permission key={actions} resources={RESOURCES.dashboards} actions={actions}>
                    <Dashboard {...options} />
                  </Permission>
                );
              })}
            </OptionsBox>
          </div>
          {index === columns.length - 1 || <div className={css.divider} />}
        </Fragment>
      ))}
    </div>
  );
}

DashboardColumns.displayName = "DashboardColumns";

DashboardColumns.propTypes = {
  columns: PropTypes.array
};

export default DashboardColumns;
