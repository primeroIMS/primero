// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import Permission, { RESOURCES } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { dashboardType } from "../../utils";
import css from "../styles.css";

function DashboardList({ dashboards }) {
  return (
    <div className={css.container}>
      {dashboards.map((dashboard, index) => {
        const { type, actions, options } = dashboard;
        const Dashboard = dashboardType(type);

        return (
          <Permission key={actions} resources={RESOURCES.dashboards} actions={actions}>
            <div className={css.optionsBox}>
              <OptionsBox flat>
                <Dashboard {...options} />
              </OptionsBox>
            </div>
            {index === dashboards.length - 1 || <div className={css.divider} />}
          </Permission>
        );
      })}
    </div>
  );
}

DashboardList.displayName = "DashboardList";

DashboardList.propTypes = {
  dashboards: PropTypes.array
};

export default DashboardList;
